"use client";

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Banknote, ChevronRight, CircleCheck, ClipboardCheck, LockKeyhole, Receipt, Wallet } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { href } from "../../lib/navigation";
import { useQuery } from "../../lib/query";
import { byId, cashFor, currency, openSession, upsert, uuid, type CashMovement, type Demo, type Session } from "../../lib/v2/model";
import { commit, useDemo } from "../../lib/v2/store";
import { Heading, Panel } from "../ui";
import { Details, Rows } from "./common";
import { MoneyField, readMoney } from "./money-field";

type Activity = {
  id: string; type: CashMovement["kind"] | "Apertura" | "Cierre"; amount: number; after: number;
  description: string; timestamp: string; reference: string; sale?: string;
};

function entries(demo: Demo, session: Session): Activity[] {
  let balance = session.opening;
  const events: Activity[] = [{ id: session.id + "-apertura", type: "Apertura", description: session.openingReason || "Fondo inicial", amount: balance, after: balance, timestamp: session.openedAt, reference: session.id }];
  for (const move of demo.cash.filter((item) => item.session === session.id)) {
    balance += move.amount;
    events.push({ id: move.id, type: move.kind, description: move.kind === "Venta" ? "Cobro en efectivo · " + move.reason : move.reason, amount: move.amount, after: balance, timestamp: move.timestamp, reference: byId(demo.sales, move.sale ?? "")?.folio ?? move.id, sale: move.sale });
  }
  if (session.closedAt) events.push({ id: session.id + "-cierre", type: "Cierre", description: session.reason || "Arqueo confirmado", amount: session.counted ?? 0, after: session.expected ?? balance, timestamp: session.closedAt, reference: session.id });
  return events.reverse();
}

function breakdown(demo: Demo, session: Session) {
  const moves = demo.cash.filter((item) => item.session === session.id);
  const sum = (kind: CashMovement["kind"]) => moves.filter((item) => item.kind === kind).reduce((total, item) => total + item.amount, 0);
  return [["Efectivo inicial", currency(session.opening)], ["Entradas manuales", currency(sum("Entrada"))], ["Salidas manuales", signed(sum("Salida"))], ["Cobros en efectivo", currency(sum("Venta"))], ["Ajustes", signed(sum("Ajuste"))]] as [string, string][];
}

const signed = (amount: number) => amount === 0 ? currency(0) : (amount < 0 ? "−" : "+") + currency(Math.abs(amount));
const differenceLabel = (amount: number) => amount < 0 ? "Faltante" : amount > 0 ? "Sobrante" : "Sin diferencia";
const referenceLabel = (event: Activity) => event.sale ? event.reference : event.reference.slice(0, 8).toUpperCase();
const timelineIcon = { Apertura: Wallet, Entrada: ArrowDownLeft, Salida: ArrowUpRight, Venta: Receipt, Ajuste: Banknote, Cierre: LockKeyhole };

export function Cash() {
  const demo = useDemo();
  const { params, update } = useQuery();
  const [tab, setTab] = useState<"Resumen" | "Actividad">("Resumen");
  const [filter, setFilter] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileActions, setMobileActions] = useState(false);
  const branch = byId(demo.branches, demo.branch);
  const timestamp = (value: string) => new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short", timeZone: branch?.zone ?? demo.business.zone }).format(new Date(value));
  const sessions = demo.sessions.filter((session) => session.branch === demo.branch).toReversed();
  const active = sessions.find((session) => !session.closedAt);
  const latest = sessions.find((session) => session.closedAt);
  const current = active ?? latest;
  const activity = current ? entries(demo, current) : [];
  const action = params.get("ficha");
  const history = byId(sessions, action ?? "");
  const entry = byId(activity, action ?? "");
  const open = (id: string) => update({ ficha: id });
  const close = () => update({ ficha: null }, true);
  const balance = active ? cashFor(demo, active) : 0;
  const returnId = params.get("volverVenta");
  const returnSale = demo.sales.find((sale) => sale.id === returnId && sale.branch === demo.branch && ["Borrador", "Pendiente de pago"].includes(sale.status));
  const routeBack = returnSale ? href("ventas/nueva", { ficha: returnSale.id, paso: "efectivo" }) : null;
  const recordMovement = (kind: "entrada" | "salida") => { setMobileActions(false); open(kind); };
  return <>
    <Heading title="Caja"/>
    <div className="cash-workspace">
      <section className="surface cash-register" aria-label="Registro principal">
        <header className="cash-register-heading">
          <span className="cash-register-icon"><Wallet size={20}/></span>
          <div><h2>Registro principal</h2><p>{branch?.name}{active ? " · Sesión activa" : ""}</p></div>
          <span className={`status-chip cash-state ${active ? "" : "cash-closed"}`}><span/>{active ? "Abierta" : "Cerrada"}</span>
        </header>
        <div className="cash-balance"><span>{active ? "Efectivo esperado" : "Fondo sugerido para abrir"}</span><strong>{currency(active ? balance : latest?.kept ?? 0)} <small>MXN</small></strong>
          <p>{active ? "Apertura · " + timestamp(active.openedAt) : latest ? "Efectivo retenido en el último cierre." : "Abrir con el efectivo que hay en el registro."}</p>
        </div>
        <div className="cash-shortcuts">
          {active ? <>
            <button className="button cash-desktop-motion" onClick={() => recordMovement("entrada")}><ArrowDownLeft size={17}/>Entrada de efectivo</button>
            <button className="button cash-desktop-motion" onClick={() => recordMovement("salida")}><ArrowUpRight size={17}/>Salida de efectivo</button>
            <button className="button cash-mobile-motion" onClick={() => setMobileActions(true)}><Banknote size={17}/>Registrar movimiento</button>
            <button className="button primary" onClick={() => open("arqueo")}><ClipboardCheck size={16}/>Arqueo y cierre</button>
          </> : <button className="button primary" onClick={() => open("abrir")}><Wallet size={16}/>Abrir caja</button>}
          {active && <Link className="text-button cash-pos-link" href={routeBack ?? href("ventas/nueva")}>{routeBack ? "Retomar cobro" : "Ir al POS"}<ChevronRight size={15}/></Link>}
        </div>
      </section>
      {notice && <p className="cash-notice" role="status"><CircleCheck size={18}/>{notice}</p>}
      {returnSale && !active && <p className="cash-return">El borrador {returnSale.folio} está guardado. Abre la caja y vuelve al cobro. <Link className="text-button" href={href("ventas/nueva", { ficha: returnSale.id })}>Volver al carrito</Link></p>}
      <section className="surface cash-section">
        <header className="cash-tabs"><div className="segmented" role="group" aria-label="Vista de caja">{(["Resumen", "Actividad"] as const).map((item) => <button key={item} aria-pressed={tab === item} onClick={() => setTab(item)}>{item}</button>)}</div>
          {tab === "Actividad" && <label className="cash-filter">Tipo<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Todos</option>{Object.keys(timelineIcon).map((item) => <option key={item}>{item}</option>)}</select></label>}
        </header>
        {tab === "Resumen" && (active ? <Details fields={breakdown(demo, active)}/> : latest ? <Details fields={[["Último cierre", timestamp(latest.closedAt!)], ["Efectivo contado", currency(latest.counted!)], [differenceLabel(latest.counted! - latest.expected!), signed(latest.counted! - latest.expected!)], ["Sugerencia próxima apertura", currency(latest.kept ?? 0)]]}/> : <p className="cash-empty">Aquí verás las entradas, salidas y cobros de la sesión cuando abras caja.</p>)}
        {tab === "Actividad" && <ActivityList activity={activity.filter((item) => !filter || item.type === filter)} timestamp={timestamp} open={open}/>}
      </section>
      {sessions.length > 0 && <section className="cash-history"><h2>Historial de sesiones</h2>
        <Rows title="Historial de sesiones" columns={["Apertura", "Estado", "Efectivo esperado", "Diferencia"]} rows={sessions.map((item) => ({ id: item.id, name: timestamp(item.openedAt), values: [item.closedAt ? "Cerrada" : "Abierta", currency(cashFor(demo, item)), item.closedAt ? signed(item.counted! - item.expected!) : "—"], open: () => open(item.id) }))}/>
      </section>}
    </div>
    {mobileActions && <Panel title="Registrar movimiento" sheet close={() => setMobileActions(false)}><div className="cash-sheet-options">
      <button className="button" onClick={() => recordMovement("entrada")}><ArrowDownLeft size={18}/>Entrada de efectivo</button>
      <button className="button" onClick={() => recordMovement("salida")}><ArrowUpRight size={18}/>Salida de efectivo</button>
    </div></Panel>}
    {action === "abrir" && !active && <Opening suggested={latest?.kept ?? 0} previous={!!latest} close={close} saved={(amount) => {
      setNotice("Caja abierta con " + currency(amount) + " MXN.");
      setTab("Actividad");
      setFilter("");
      close();
    }}/>}
    {(action === "entrada" || action === "salida") && active && <Movement mode={action} session={active} balance={balance} close={close} saved={(move, after) => {
      setNotice(move.kind + " registrada · " + signed(move.amount) + " · Efectivo esperado " + currency(after) + " MXN.");
      setTab("Actividad");
      if (filter && filter !== move.kind) setFilter("");
      close();
    }}/>}
    {action === "arqueo" && active && <Closing session={active} close={close} saved={(kept) => {
      setNotice("Caja cerrada. " + currency(kept) + " MXN sugeridos para la próxima apertura.");
      setTab("Resumen");
      close();
    }}/>}
    {entry && <Panel title="Detalle de actividad" close={close} footer={<button className="button" onClick={close}>Volver a actividad</button>}>
      <div className="detail-hero"><h3>{entry.type}</h3><p>{entry.description}</p></div>
      <Details fields={[["Importe", entry.type === "Apertura" || entry.type === "Cierre" ? currency(entry.amount) : signed(entry.amount)], ["Efectivo esperado después", currency(entry.after)], ["Fecha y hora", timestamp(entry.timestamp)], ["Referencia", referenceLabel(entry)], ["Actor", "Equipo Demo"]]}/>
      {entry.sale && <div className="actions"><Link className="button" href={href("ventas/nueva", { ficha: entry.sale })}>Ver venta {entry.reference}</Link></div>}
    </Panel>}
    {history && <Panel title="Detalle de sesión" close={close}><Details fields={[["Estado", history.closedAt ? "Cerrada" : "Abierta"], ["Apertura", timestamp(history.openedAt)], ["Efectivo esperado", currency(cashFor(demo, history))], ...breakdown(demo, history), ...(history.closedAt ? [["Contado", currency(history.counted!)], [differenceLabel(history.counted! - history.expected!), signed(history.counted! - history.expected!)], ["Retenido", currency(history.kept!)], ["Retirado", currency(history.withdrawn!)], ["Motivo", history.reason || "—"]] as [string, string][] : [])]}/><ActivityList activity={entries(demo, history)} timestamp={timestamp}/></Panel>}
  </>;
}

function ActivityList({ activity, timestamp, open }: { activity: Activity[]; timestamp: (value: string) => string; open?: (id: string) => void }) {
  if (!activity.length) return <p className="cash-empty">No hay movimientos para este filtro.</p>;
  return <ul className="cash-timeline" aria-label="Actividad de caja">{activity.map((event) => {
    const Icon = timelineIcon[event.type];
    const motion = !["Apertura", "Cierre"].includes(event.type);
    const amount = motion ? signed(event.amount) : currency(event.amount);
    const content = <><span className="timeline-icon"><Icon size={17}/></span><span className="timeline-title"><strong>{event.type} · {event.description}</strong><small>{timestamp(event.timestamp)} · Equipo Demo</small><small>Ref. {referenceLabel(event)}</small></span><strong className={`timeline-amount ${motion && event.amount < 0 ? "negative" : ""}`}>{amount}</strong>{open && <ChevronRight size={16}/>}</>;
    return <li key={event.id}>{open ? <button className="timeline-row" onClick={() => open(event.id)}>{content}</button> : <div className="timeline-row">{content}</div>}</li>;
  })}</ul>;
}

function TextInput({ label, value, change, error, hint }: { label: string; value: string; change: (value: string) => void; error?: string; hint?: ReactNode }) {
  return <label>{label}<input value={value} onChange={(event) => change(event.target.value)} aria-invalid={!!error} aria-describedby={error || hint ? "cash-note" : undefined}/>{error ? <span id="cash-note" className="field-error" role="alert">{error}</span> : hint && <span id="cash-note" className="field-hint">{hint}</span>}</label>;
}

function Opening({ suggested, previous, close, saved }: { suggested: number; previous: boolean; close: () => void; saved: (amount: number) => void }) {
  const [value, setValue] = useState(String(suggested / 100));
  const [reason, setReason] = useState("");
  const [error, setError] = useState<"amount" | "reason" | "">("");
  const [problem, setProblem] = useState("");
  const amount = readMoney(value);
  const changed = previous && Number.isFinite(amount) && amount !== suggested;
  const submitted = useRef(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (submitted.current) return;
    if (!Number.isSafeInteger(amount)) { setError("amount"); return; }
    if (changed && !reason.trim()) { setError("reason"); return; }
    try {
      commit((current) => {
        if (openSession(current)) throw Error("Ya existe una sesión abierta para este registro.");
        return { ...current, sessions: [...current.sessions, { id: uuid(), opening: amount, openingReason: changed ? reason.trim() : undefined, branch: current.branch, openedAt: new Date().toISOString() }] };
      });
      submitted.current = true;
      saved(amount);
    } catch (failure) { setProblem((failure as Error).message); }
  }
  return <Panel title="Abrir caja" close={close} sheet footer={<><button className="button" onClick={close}>Cancelar</button><button form="cash-form" className="button primary">Confirmar apertura</button></>}>
    <form id="cash-form" className="editor form-stack" onSubmit={submit}>
      <div className="cash-form-callout"><span>Fondo sugerido</span><strong>{currency(suggested)} MXN</strong><p>{previous ? "Es el efectivo retenido al cerrar la sesión anterior." : "Esta caja aún no tiene un cierre previo."}</p></div>
      <MoneyField label="Efectivo inicial (MXN)" value={value} change={(next) => { setValue(next); setError(""); }} error={error === "amount" ? "Escribe un importe válido. Puedes abrir con cero." : undefined}/>
      {changed && <TextInput label="Motivo del cambio" value={reason} change={(next) => { setReason(next); setError(""); }} error={error === "reason" ? "Explica por qué el fondo difiere del último cierre." : undefined}/>}
      {problem && <p className="error-box" role="alert">{problem}</p>}
    </form>
  </Panel>;
}

function Movement({ mode, session, balance, close, saved }: { mode: "entrada" | "salida"; session: Session; balance: number; close: () => void; saved: (move: CashMovement, after: number) => void }) {
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<{ amount?: string; reason?: string; form?: string }>({});
  const submitted = useRef(false);
  const amount = readMoney(value);
  const income = mode === "entrada";
  const signedAmount = income ? amount : -amount;
  function submit(event: FormEvent) {
    event.preventDefault();
    if (submitted.current) return;
    const fields = { amount: !(amount > 0) ? "Escribe un importe mayor que cero, con hasta dos decimales." : undefined, reason: reason.trim() ? undefined : "Describe el motivo del movimiento." };
    if (fields.amount || fields.reason) { setError(fields); return; }
    const movement: CashMovement = { id: uuid(), session: session.id, amount: signedAmount, kind: income ? "Entrada" : "Salida", reason: reason.trim(), timestamp: new Date().toISOString() };
    let after = balance + signedAmount;
    try {
      commit((current) => {
        const active = openSession(current);
        if (!active || active.id !== session.id) throw Error("La sesión ya fue cerrada.");
        after = cashFor(current, active) + signedAmount;
        if (after < 0) throw Error("La salida supera el efectivo esperado.");
        return { ...current, cash: [...current.cash, movement] };
      });
      submitted.current = true;
      saved(movement, after);
    } catch (failure) {
      const message = (failure as Error).message;
      setError(message.includes("supera") ? { amount: message } : { form: message });
    }
  }
  return <Panel title={income ? "Entrada de efectivo" : "Salida de efectivo"} sheet close={close} footer={<><button className="button" onClick={close}>Cancelar</button><button form="cash-form" className="button primary">Confirmar movimiento</button></>}>
    <form id="cash-form" className="editor form-stack" onSubmit={submit}>
      <Details fields={[["Efectivo esperado", currency(balance)], ["Después del movimiento", amount > 0 ? currency(balance + signedAmount) : "—"]]}/>
      <MoneyField label="Importe (MXN)" value={value} change={(next) => { setValue(next); setError((old) => ({ ...old, amount: undefined })); }} error={error.amount}/>
      <TextInput label="Motivo" value={reason} change={(next) => { setReason(next); setError((old) => ({ ...old, reason: undefined })); }} error={error.reason}/>
      {error.form && <p className="error-box" role="alert">{error.form}</p>}
    </form>
  </Panel>;
}

function Closing({ session, close, saved }: { session: Session; close: () => void; saved: (kept: number) => void }) {
  const demo = useDemo();
  const expected = cashFor(demo, session);
  const [stage, setStage] = useState<"conteo" | "distribución" | "confirmación">("conteo");
  const [countedText, setCounted] = useState("");
  const [keptText, setKept] = useState("");
  const [withdrawnText, setWithdrawn] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<{ counted?: string; kept?: string; withdrawn?: string; reason?: string; form?: string }>({});
  const submitted = useRef(false);
  const reviewExpected = useRef<number | null>(null);
  const steps = useRef<HTMLOListElement>(null);
  const previousStage = useRef(stage);
  useEffect(() => {
    if (previousStage.current === stage) return;
    previousStage.current = stage;
    steps.current?.closest(".panel-body")?.scrollTo({ top: 0 });
    steps.current?.focus({ preventScroll: true });
  }, [stage]);
  const counted = readMoney(countedText);
  const kept = readMoney(keptText);
  const variance = counted - expected;
  const suggestedWithdrawal = Number.isFinite(kept) && kept <= counted ? String((counted - kept) / 100) : "";
  const withdrawalInput = withdrawnText ?? suggestedWithdrawal;
  const withdrawn = readMoney(withdrawalInput);
  const knownCount = Number.isSafeInteger(counted);
  const difference = knownCount ? differenceLabel(variance) : "Diferencia";
  const varianceDisplay = knownCount ? signed(variance) : "—";
  const goBack = () => { setErrors({}); setStage(stage === "confirmación" ? "distribución" : "conteo"); };
  function next(event: FormEvent) {
    event.preventDefault();
    if (submitted.current) return;
    if (stage === "conteo") {
      if (!knownCount) { setErrors({ counted: "Escribe el efectivo contado con hasta dos decimales." }); return; }
      if (variance !== 0 && !reason.trim()) { setErrors({ reason: "Indica el motivo de la diferencia." }); return; }
      if (!keptText) setKept(String(counted / 100));
      setErrors({});
      setStage("distribución");
      return;
    }
    if (stage === "distribución") {
      if (!Number.isSafeInteger(kept) || kept > counted) { setErrors({ kept: "El efectivo retenido no puede superar el contado." }); return; }
      if (!Number.isSafeInteger(withdrawn) || kept + withdrawn !== counted) { setErrors({ withdrawn: "El efectivo retenido y retirado debe sumar el efectivo contado." }); return; }
      reviewExpected.current = expected;
      setErrors({});
      setStage("confirmación");
      return;
    }
    try {
      commit((current) => {
        const active = openSession(current);
        if (!active || active.id !== session.id) throw Error("La sesión ya fue cerrada.");
        const latestExpected = cashFor(current, active);
        if (latestExpected !== reviewExpected.current) throw Error("El efectivo esperado cambió. Revisa el conteo y confirma otra vez.");
        return { ...current, sessions: upsert(current.sessions, { ...active, expected: latestExpected, counted, kept, withdrawn, reason: variance !== 0 ? reason.trim() : "", closedAt: new Date().toISOString() }) };
      });
      submitted.current = true;
      saved(kept);
    } catch (failure) {
      const message = (failure as Error).message;
      if (message.includes("cambió")) setStage("conteo");
      setErrors({ form: message });
    }
  }
  return <Panel title="Arqueo y cierre" close={close} sheet footer={<><button className="button" onClick={stage === "conteo" ? close : goBack}>{stage === "conteo" ? "Cancelar" : "Atrás"}</button><button form="cash-form" className="button primary">{stage === "conteo" ? "Continuar a distribución" : stage === "distribución" ? "Revisar cierre" : "Confirmar cierre"}</button></>}>
    <form className="editor form-stack" id="cash-form" onSubmit={next}>
      <ol ref={steps} tabIndex={-1} className="cash-steps" aria-label={"Pasos del cierre · " + stage}>{(["conteo", "distribución", "confirmación"] as const).map((item, index) => <li key={item} aria-current={item === stage ? "step" : undefined}><span>{index + 1}</span>{item}</li>)}</ol>
      {stage === "conteo" && <>
        <div className="cash-form-callout"><span>Efectivo esperado</span><strong>{currency(expected)} MXN</strong></div>
        <Details fields={breakdown(demo, session)}/>
        <MoneyField label="Efectivo contado (MXN)" value={countedText} change={(nextValue) => { setCounted(nextValue); setErrors({}); }} error={errors.counted}/>
        {knownCount && <div className={`cash-variance ${variance < 0 ? "negative" : ""}`} aria-live="polite"><span>{difference}</span><strong>{varianceDisplay} MXN</strong></div>}
        {knownCount && variance !== 0 && <TextInput label="Motivo de diferencia" value={reason} change={(value) => { setReason(value); setErrors({}); }} error={errors.reason}/>}
      </>}
      {stage === "distribución" && <>
        <Details fields={[["Contado", currency(counted)], [difference, varianceDisplay]]}/>
        <MoneyField label="Efectivo retenido (MXN)" value={keptText} change={(value) => { setKept(value); setErrors({}); }} hint="Este importe se sugiere para la siguiente apertura." error={errors.kept}/>
        <MoneyField label="Efectivo retirado (MXN)" value={withdrawalInput} change={(value) => { setWithdrawn(value); setErrors({}); }} hint="Se calcula con el contado menos el retenido." error={errors.withdrawn}/>
      </>}
      {stage === "confirmación" && <>
        <div className="cash-form-callout"><span>Revisa antes de cerrar</span><strong>{currency(counted)} MXN contados</strong><p>El cierre guardará este resumen en el historial.</p></div>
        <Details fields={[["Efectivo esperado", currency(expected)], ["Efectivo contado", currency(counted)], [difference, varianceDisplay], ["Motivo", reason || "—"], ["Retenido para la próxima apertura", currency(kept)], ["Retirado", currency(withdrawn)]]}/>
      </>}
      {errors.form && <p className="error-box" role="alert">{errors.form}</p>}
    </form>
  </Panel>;
}
