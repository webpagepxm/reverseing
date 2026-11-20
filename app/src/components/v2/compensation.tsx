"use client";

import Link from "next/link";
import { href } from "../../lib/navigation";
import { useQuery } from "../../lib/query";
import { byId, currency, todayAt, upsert, uuid, type CommissionRule, type Demo, type Payout } from "../../lib/v2/model";
import { commit, useDemo } from "../../lib/v2/store";
import { Heading, Panel } from "../ui";
import { Action, Choice, Details, Editor, Field, Metrics, numeric, Rows, text } from "./common";

function total(demo: Demo, payout: Payout) {
  return demo.earnings.filter((item) => payout.entries.includes(item.id)).reduce((sum, item) => sum + item.commission + item.tip, 0);
}

export function Compensation({ route }: { route: string }) {
  const demo = useDemo();
  const { params, update } = useQuery();
  const date = todayAt(byId(demo.branches, demo.branch)?.zone ?? demo.business.zone);
  const selected = params.get("ficha");
  const close = () => update({ ficha: null, editar: null }, true);
  const open = (id: string, edit: string | null = null) => update({ ficha: id, editar: edit });
  const memberName = (id: string) => byId(demo.staff, id)?.name ?? "Profesional";
  const eligible = demo.staff.filter((item) => !item.archived);
  const entries = demo.earnings.filter((item) => item.branch === demo.branch);
  if (route.endsWith("comisiones")) {
    const rule = byId(demo.rules, selected ?? "");
    const editing = selected === "nuevo" || params.get("editar") === "1";
    const ruleState = (item: CommissionRule) => date < item.from ? "Programada" : item.until && date > item.until ? "Finalizada" : "Vigente";
    return <>
      <Heading title="Comisiones" action={<button className="button primary" onClick={() => open("nuevo")}>Nueva regla</button>}/>
      <section className="surface v2-card"><h2>Reglas y vigencia</h2><p>Regla propia de la demo. Comisión sobre el valor de artículos de la familia, sin propina. Las anulaciones generan un ajuste separado.</p>
        <Rows columns={["Profesional", "Familia", "Tasa", "Desde", "Hasta", "Estado"]} rows={demo.rules.map((item) => ({ id: item.id, name: memberName(item.staff), values: [item.category, item.rate + " %", item.from, item.until || "Continua", ruleState(item)], open: () => open(item.id) }))}/>
      </section>
      <section className="surface v2-card"><h2>Devengos y ajustes</h2>
        <Metrics items={[["Comisión neta", currency(entries.reduce((sum, item) => sum + item.commission, 0))], ["Propinas netas", currency(entries.reduce((sum, item) => sum + item.tip, 0))]]}/>
        <Rows columns={["Profesional", "Comisión", "Base", "Propina", "Tipo", "Venta"]} rows={entries.toReversed().map((item) => ({ id: item.id, name: memberName(item.staff), values: [currency(item.commission), currency(item.base), currency(item.tip), item.adjustment ? "Ajuste" : "Devengo", <Link key={item.id} href={href("ventas/nueva", { ficha: item.sale })}>{byId(demo.sales, item.sale)?.folio}</Link>] }))}/>
      </section>
      {rule && !editing && <Panel title="Regla de comisión" close={close}><Details fields={[["Profesional", memberName(rule.staff)], ["Familia", rule.category], ["Porcentaje", rule.rate + " %"], ["Desde", rule.from], ["Hasta", rule.until || "Continua"], ["Estado", ruleState(rule)]]}/><div className="actions"><button className="button primary" onClick={() => open(rule.id, "1")}>Crear nueva versión</button></div></Panel>}
      {editing && <Editor title={rule ? "Nueva versión de comisión" : "Nueva regla"} close={close} save={(data) => commit((current) => {
        const next: CommissionRule = { id: uuid(), staff: text(data, "staff"), category: text(data, "category") as CommissionRule["category"], rate: numeric(data, "rate"), from: text(data, "from"), until: text(data, "until") };
        if (!next.staff || next.rate < 0 || next.rate > 100 || !Number.isFinite(next.rate) || (next.until && next.until < next.from)) throw Error("Revisa el porcentaje y la vigencia.");
        if (rule && (next.from <= rule.from || next.from < date)) throw Error("La nueva vigencia debe comenzar después de la anterior, a partir de hoy.");
        if (rule && current.earnings.some((item) => item.rule === rule.id && item.date >= next.from)) throw Error("La fecha se cruza con devengos ya registrados. Elige una fecha posterior.");
        let rules = current.rules;
        if (rule && (!rule.until || rule.until >= next.from)) {
          const previous = new Date(next.from + "T00:00:00Z");
          previous.setUTCDate(previous.getUTCDate() - 1);
          rules = upsert(rules, { ...rule, until: previous.toISOString().slice(0, 10) });
        }
        if (rules.some((item) => item.staff === next.staff && item.category === next.category && (!item.until || item.until >= next.from) && (!next.until || item.from <= next.until))) throw Error("Ya hay una regla vigente para ese profesional y familia en el período.");
        return { ...current, rules: [...rules, next] };
      })}>
        <Choice name="staff" label="Profesional" items={rule ? eligible.filter((item) => item.id === rule.staff) : eligible} value={rule?.staff}/><Choice name="category" label="Familia" items={(rule ? [rule.category] : ["Servicios", "Productos"]).map((name) => ({ id: name, name }))} value={rule?.category}/>
        <Field name="rate" label="Porcentaje" type="number" min={0} max={100} step={.01} value={rule?.rate ?? 20} required/><Field name="from" label="Vigente desde" type="date" value={date} required/><Field name="until" label="Vigente hasta" type="date"/>
      </Editor>}
    </>;
  }

  const payout = byId(demo.payouts, selected ?? "");
  const stage = (step: Payout["status"], expected: Payout["status"], reference = "") => commit((current) => {
    if (!payout) return current;
    const stored = byId(current.payouts, payout.id);
    if (!stored || stored.status !== expected) return current;
    if (step === "Pago registrado" && current.payouts.some((item) => item.reference === reference && item.id !== stored.id)) throw Error("La referencia de pago ya está registrada.");
    return { ...current, payouts: upsert(current.payouts, { ...stored, status: step, reference, history: [...stored.history, step + " · " + new Date().toLocaleString("es-MX")] }) };
  });
  const editingRef = params.get("editar") === "pago";
  const unallocated = demo.earnings.filter((item) => !demo.payouts.some((entry) => entry.entries.includes(item.id)));
  return <>
    <Heading title="Liquidaciones" action={<button className="button primary" onClick={() => open("nuevo")}>Nueva liquidación</button>}/>
    <Metrics items={[["Por asignar", currency(unallocated.reduce((sum, item) => sum + item.commission + item.tip, 0))], ["En proceso", currency(demo.payouts.filter((item) => item.status !== "Pago registrado").reduce((sum, item) => sum + total(demo, item), 0))]]}/>
    <Rows columns={["Profesional", "Total", "Período", "Estado", "Referencia"]} rows={demo.payouts.map((item) => ({ id: item.id, name: memberName(item.staff), values: [currency(total(demo, item)), item.from + " a " + item.until, item.status, item.reference || "—"], open: () => open(item.id) }))}/>
    {selected === "nuevo" && <Editor title="Nueva liquidación" close={close} save={(data) => commit((current) => {
      const staff = text(data, "staff");
      const from = text(data, "from");
      const until = text(data, "until");
      if (until < from) throw Error("El fin del período debe ser posterior o igual al inicio.");
      const entries = current.earnings.filter((item) => item.staff === staff && item.date >= from && item.date <= until && !current.payouts.some((record) => record.entries.includes(item.id)));
      if (!entries.length) throw Error("El profesional no tiene devengos pendientes en ese período.");
      return { ...current, payouts: [...current.payouts, { id: uuid(), staff, from, until, entries: entries.map((item) => item.id), status: "Borrador", reference: "", history: ["Borrador · " + new Date().toLocaleString("es-MX")] }] };
    })}><Choice name="staff" label="Profesional" items={demo.staff}/><Field name="from" label="Desde" type="date" value={date} required/><Field name="until" label="Hasta" type="date" value={date} required/></Editor>}
    {payout && editingRef && <Editor title="Registrar pago externo simulado" close={() => open(payout.id)} label="Registrar referencia" save={(data) => {
      const reference = text(data, "reference");
      if (!reference) throw Error("Escribe una referencia ficticia.");
      if (total(demo, payout) < 0) throw Error("El saldo es negativo. Revisa los ajustes antes de registrar un pago.");
      stage("Pago registrado", "Aprobada", reference);
    }}><Field name="reference" label="Referencia de demostración" required/></Editor>}
    {payout && !editingRef && <Panel title="Detalle de liquidación" close={close}><div className="detail-hero"><span className="status-chip">{payout.status}</span><h3>{memberName(payout.staff)}</h3><p>{payout.from} a {payout.until}</p></div>
      <Details fields={[["Total", currency(total(demo, payout))], ["Comisión", currency(demo.earnings.filter((item) => payout.entries.includes(item.id) && !item.adjustment).reduce((sum, item) => sum + item.commission, 0))], ["Propinas", currency(demo.earnings.filter((item) => payout.entries.includes(item.id) && !item.adjustment).reduce((sum, item) => sum + item.tip, 0))], ["Ajustes", currency(demo.earnings.filter((item) => payout.entries.includes(item.id) && item.adjustment).reduce((sum, item) => sum + item.commission + item.tip, 0))], ["Referencia", payout.reference]]}/>
      <div className="actions">{payout.status === "Borrador" && <Action label="Marcar revisada" run={() => stage("Revisada", "Borrador")}/>}
        {payout.status === "Revisada" && <Action label="Aprobar liquidación" confirmation="¿Registrar la aprobación de demostración?" run={() => stage("Aprobada", "Revisada")}/>}
        {payout.status === "Aprobada" && <button className="button primary" onClick={() => open(payout.id, "pago")}>Registrar pago externo simulado</button>}
      </div>
      <h3>Historial</h3><ul className="history">{payout.history.map((item, index) => <li key={index}>{item}</li>)}</ul>
    </Panel>}
  </>;
}
