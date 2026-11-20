"use client";

import Link from "next/link";
import { useState } from "react";
import { href } from "../../lib/navigation";
import { useQuery } from "../../lib/query";
import { byId, cashFor, cents, currency, openSession, upsert, uuid } from "../../lib/v2/model";
import { commit, useDemo } from "../../lib/v2/store";
import { Heading, Panel } from "../ui";
import { Details, Editor, Field, Metrics, Rows, text } from "./common";

export function Cash() {
  const demo = useDemo();
  const { params, update } = useQuery();
  const [tab, setTab] = useState("Resumen");
  const [filter, setFilter] = useState("");
  const [counted, setCounted] = useState("");
  const active = openSession(demo);
  const sessions = demo.sessions.filter((session) => session.branch === demo.branch).toReversed();
  const latest = sessions.find((session) => session.closedAt);
  const action = params.get("ficha");
  const history = action && byId(sessions, action);
  const close = () => update({ ficha: null }, true);
  const open = (page: string) => { setCounted(""); update({ ficha: page }); };
  const moves = demo.cash.filter((move) => move.session === active?.id);
  const balance = active ? cashFor(demo, active) : 0;
  const fields = (amount: number) => <Field label="Importe (MXN)" name="amount" type="number" min={amount} step={.01} required/>;
  return <>
    <Heading title="Caja" action={!active ? <button className="button primary" onClick={() => open("abrir")}>Abrir caja</button> : <button className="button primary" onClick={() => open("arqueo")}>Arqueo y cierre</button>}/>
    <Metrics items={[["Estado de caja", active ? "Abierta" : "Cerrada"], ["Efectivo esperado", currency(balance)], ["Saldo inicial", currency(active?.opening ?? 0)]]}/>
    <section className="surface v2-card"><h2>Registro principal de la sucursal</h2>
      <div className="segmented" role="group" aria-label="Vista de caja">{["Resumen", "Actividad"].map((item) => <button key={item} aria-pressed={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div>
      {tab === "Resumen" && <Details fields={[["Apertura", active ? new Date(active.openedAt).toLocaleString("es-MX") : "Sin sesión abierta"], ["Entradas", currency(moves.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0))], ["Salidas", currency(-moves.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0))], ["Sugerencia próxima apertura", currency(latest?.kept ?? 0)]]}/>}
      {active && <div className="actions"><button className="button" onClick={() => open("entrada")}>Entrada de efectivo</button><button className="button" onClick={() => open("salida")}>Salida de efectivo</button><Link className="button" href={href("ventas/nueva")}>Ir al POS</Link></div>}
      {tab === "Actividad" && <><div className="directory-toolbar"><label>Tipo<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Todos</option>{["Entrada", "Salida", "Venta", "Ajuste"].map((item) => <option key={item}>{item}</option>)}</select></label></div>
        <Rows columns={["Tipo y motivo", "Importe", "Fecha", "Usuario"]} rows={moves.filter((item) => !filter || item.kind === filter).toReversed().map((item) => ({ id: item.id, name: item.kind + " · " + item.reason, values: [currency(item.amount), new Date(item.timestamp).toLocaleString("es-MX"), item.sale ? <Link key={item.id} href={href("ventas/nueva", { ficha: item.sale })}>Equipo Demo · Ver venta</Link> : "Equipo Demo"] }))}/></>}
    </section>
    <section className="surface v2-card"><h2>Historial de sesiones</h2>
      <Rows columns={["Sesión", "Estado", "Efectivo esperado", "Diferencia"]} rows={sessions.map((item) => ({ id: item.id, name: new Date(item.openedAt).toLocaleString("es-MX"), values: [item.closedAt ? "Cerrada" : "Abierta", currency(cashFor(demo, item)), item.closedAt ? currency(item.counted! - item.expected!) : "—"], open: () => open(item.id) }))}/>
    </section>
    {action === "abrir" && <Editor title="Abrir caja" close={close} label="Confirmar apertura" save={(data) => commit((current) => {
      if (openSession(current)) throw Error("Ya existe una sesión abierta para este registro.");
      const opening = cents(data.get("amount"));
      if (opening < 0 || !Number.isSafeInteger(opening)) throw Error("Introduce un saldo inicial válido.");
      return { ...current, sessions: [...current.sessions, { id: uuid(), opening, branch: current.branch, openedAt: new Date().toISOString() }] };
    })}><p>Registro principal · {byId(demo.branches, demo.branch)?.name}</p><Field label="Efectivo inicial (MXN)" name="amount" type="number" min={0} step={.01} value={(latest?.kept ?? 0) / 100} required/></Editor>}
    {(action === "entrada" || action === "salida") && <Editor title={action === "entrada" ? "Entrada de efectivo" : "Salida de efectivo"} close={close} label="Confirmar movimiento" save={(data) => commit((current) => {
      const session = openSession(current);
      if (!session || session.id !== active?.id) throw Error("La sesión ya fue cerrada.");
      const amount = cents(data.get("amount"));
      const reason = text(data, "reason");
      if (amount <= 0 || !Number.isSafeInteger(amount) || !reason) throw Error("Indica un importe positivo y un motivo.");
      if (action === "salida" && amount > cashFor(current, session)) throw Error("La salida supera el efectivo esperado.");
      return { ...current, cash: [...current.cash, { id: uuid(), session: session.id, amount: action === "entrada" ? amount : -amount, kind: action === "entrada" ? "Entrada" : "Salida", reason, timestamp: new Date().toISOString() }] };
    })}>{fields(.01)}<Field label="Motivo" name="reason" required/></Editor>}
    {action === "arqueo" && active && <Editor title="Arqueo y cierre" close={close} label="Confirmar cierre" save={(data) => commit((current) => {
      const session = openSession(current);
      if (!session || session.id !== active.id) throw Error("La sesión ya fue cerrada.");
      const expected = cashFor(current, session);
      const counted = cents(data.get("counted"));
      const kept = cents(data.get("kept"));
      const withdrawn = cents(data.get("withdrawn"));
      const reason = text(data, "reason");
      if (![counted, kept, withdrawn].every((item) => Number.isSafeInteger(item) && item >= 0) || counted !== kept + withdrawn) throw Error("El efectivo retenido y retirado debe sumar el efectivo contado.");
      if (counted !== expected && !reason) throw Error("Escribe el motivo de la diferencia.");
      return { ...current, sessions: upsert(current.sessions, { ...session, expected, counted, kept, withdrawn, reason, closedAt: new Date().toISOString() }) };
    })}>
      <Details fields={[["Efectivo esperado", currency(balance)], ["Diferencia", counted ? currency(cents(counted) - balance) : "—"]]}/>
      <label>Efectivo contado (MXN)<input name="counted" type="number" step=".01" min={0} value={counted} onChange={(event) => setCounted(event.target.value)} required/></label>
      <Field label="Efectivo retenido (MXN)" name="kept" type="number" step={.01} min={0} required/><Field label="Efectivo retirado (MXN)" name="withdrawn" type="number" step={.01} min={0} required/><Field label="Motivo de diferencia" name="reason"/>
    </Editor>}
    {history && <Panel title="Detalle de sesión" close={close}><Details fields={[["Estado", history.closedAt ? "Cerrada" : "Abierta"], ["Saldo inicial", currency(history.opening)], ["Efectivo esperado", currency(cashFor(demo, history))], ...(history.closedAt ? [["Contado", currency(history.counted!)], ["Diferencia", currency(history.counted! - history.expected!)], ["Retenido", currency(history.kept!)], ["Retirado", currency(history.withdrawn!)], ["Motivo", history.reason ?? ""]] as [string, string][] : [])]}/><Rows columns={["Movimiento", "Importe"]} rows={demo.cash.filter((item) => item.session === history.id).map((item) => ({ id: item.id, name: item.kind + " · " + item.reason, values: [currency(item.amount)] }))}/></Panel>}
  </>;
}
