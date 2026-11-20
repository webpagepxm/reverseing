"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { demoDate, moveDate, time } from "../../lib/demo";
import { href } from "../../lib/navigation";
import { useQuery } from "../../lib/query";
import { byId, cashFor, currency, openSession, saleTotal, stockFor, todayAt, upsert, uuid, type Demo, type Segment } from "../../lib/v2/model";
import { commit, useDemo } from "../../lib/v2/store";
import { Heading, Panel } from "../ui";
import { Details, Editor, includes, Metrics, Rows, Search } from "./common";

const reportLinks = [
  ["Citas", "informes/citas", "Servicios, profesionales y estados"],
  ["Ventas", "informes/ventas", "Cobros, artículos y propinas"],
  ["Caja", "informes/caja", "Entradas, salidas, cierres y diferencias"],
  ["Inventario", "informes/inventario", "Existencias, movimientos, recepciones y recuentos"],
  ["Equipo y remuneración", "informes/equipo", "Citas, ventas, devengos y liquidaciones"],
  ["Paneles", "informes/paneles", "Resumen del estado operativo"],
];

function segmentMembers(demo: Demo, rule: Segment, date: string) {
  const since = moveDate(date, -(rule.days - 1));
  return demo.clients.filter((client) => {
    if (client.archived) return false;
    const quantity = rule.metric === "Compras"
      ? demo.sales.filter((item) => item.client === client.id && item.status === "Pagada" && item.date >= since && item.date <= date).length
      : demo.appointments.filter((item) => item.client === client.id && item.status !== "Cancelada" && item.status !== "Inasistencia" && item.date >= since && item.date <= date && (rule.metric !== "Servicio" || item.service === rule.service)).length;
    return rule.op === "al menos" ? quantity >= rule.threshold : quantity <= rule.threshold;
  });
}

function Segments() {
  const demo = useDemo();
  const router = useRouter();
  const { params, update } = useQuery();
  const selected = params.get("ficha");
  const segment = byId(demo.segments, selected ?? "");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("");
  const cut = todayAt(demo.business.zone);
  const close = () => update({ ficha: null, editar: null }, true);
  const open = (id: string) => update({ ficha: id, editar: null });
  const edit = selected === "nuevo" || params.get("editar") === "1";
  const rows = demo.segments.filter((item) => (!type || item.type === type) && includes(item.name, query));
  return <>
    <Heading title="Segmentos" action={<button className="button primary" onClick={() => open("nuevo")}>Nuevo segmento</button>}/>
    <Search label="Buscar segmentos" value={query} set={setQuery}><label>Tipo<select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos</option><option>Estándar</option><option>Personalizado</option></select></label></Search>
    <Rows columns={["Segmento", "Clientes", "Tipo", "Condición"]} rows={rows.map((item) => ({ id: item.id, name: item.name, values: [segmentMembers(demo, item, cut).length, item.type, `${item.metric} ${item.op} ${item.threshold} · ${item.days} días`], open: () => open(item.id) }))}/>
    {edit && <SegmentEdit key={selected} segment={segment} cut={cut} close={close}/>}
    {segment && !edit && <Panel title="Detalle de segmento" close={close}><div className="detail-hero"><h3>{segment.name}</h3><p>{segment.type}</p></div>
      <Details fields={[["Condición", `${segment.metric} ${segment.op} ${segment.threshold}`], ["Ventana", segment.days + " días"], ["Corte", cut], ["Clientes", segmentMembers(demo, segment, cut).length]]}/>
      <div className="actions"><button className="button" onClick={() => update({ editar: "1" })}>Editar segmento</button></div>
      <Rows columns={["Clientes coincidentes"]} rows={segmentMembers(demo, segment, cut).map((item) => ({ id: item.id, name: item.name, values: [], open: () => router.push(href("clientes", { ficha: item.id })) }))}/>
    </Panel>}
  </>;
}

function SegmentEdit({ segment, cut, close }: { segment?: Segment; cut: string; close: () => void }) {
  const demo = useDemo();
  const [draft, setDraft] = useState<Segment>(segment ?? { id: "", name: "", type: "Personalizado", metric: "Compras", op: "al menos", threshold: 1, days: 30, service: "" });
  const members = segmentMembers(demo, draft, cut);
  return <Editor title={segment ? "Editar segmento" : "Nuevo segmento"} close={close} save={() => commit((current) => {
    if (!draft.name.trim() || !Number.isInteger(draft.days) || draft.days < 1 || draft.days > 3650 || !Number.isInteger(draft.threshold) || draft.threshold < 0 || (draft.metric === "Servicio" && !draft.service)) throw Error("Revisa el nombre, la condición y la ventana.");
    return { ...current, segments: upsert(current.segments, { ...draft, name: draft.name.trim(), id: draft.id || uuid() }) };
  })}>
    <label>Nombre<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required/></label>
    <label>Condición<select value={draft.metric} onChange={(e) => setDraft({ ...draft, metric: e.target.value as Segment["metric"] })}><option>Compras</option><option>Citas</option><option>Servicio</option></select></label>
    {draft.metric === "Servicio" && <label>Servicio<select required value={draft.service} onChange={(e) => setDraft({ ...draft, service: e.target.value })}><option value="">Elige un servicio</option>{demo.services.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
    <label>Operador<select value={draft.op} onChange={(e) => setDraft({ ...draft, op: e.target.value as Segment["op"] })}><option>al menos</option><option>como máximo</option></select></label>
    <FieldControl label="Cantidad" value={draft.threshold} min={0} max={100000} change={(threshold) => setDraft({ ...draft, threshold })}/>
    <FieldControl label="Ventana en días" value={draft.days} min={1} max={3650} change={(days) => setDraft({ ...draft, days })}/>
    <p role="status"><strong>Vista previa · {members.length} {members.length === 1 ? "cliente" : "clientes"}</strong><br/>Corte {cut}.</p>
  </Editor>;
}

function FieldControl({ label, value, min, max, change }: { label: string; value: number; min: number; max: number; change: (value: number) => void }) {
  return <label>{label}<input type="number" min={min} max={max} value={value} required onChange={(event) => { const number = Number(event.target.value); if (Number.isFinite(number)) change(number); }}/></label>;
}

export function Insights({ route }: { route: string }) {
  if (route === "clientes/segmentos") return <Segments/>;
  if (route === "inicio" || route.endsWith("paneles")) return <Dashboard panels={route !== "inicio"}/>;
  if (route === "informes") return <><Heading title="Biblioteca de informes"/><div className="library">{reportLinks.map(([name, path, detail]) => <Link className="surface" key={path} href={href(path)}>{name}<small>{detail}</small></Link>)}</div></>;
  return <Report route={route}/>;
}

function Dashboard({ panels }: { panels: boolean }) {
  const demo = useDemo();
  const router = useRouter();
  const day = todayAt(byId(demo.branches, demo.branch)?.zone ?? demo.business.zone);
  const appointments = demo.appointments.filter((item) => item.branch === demo.branch && item.date === day);
  const sales = demo.sales.filter((item) => item.branch === demo.branch && item.date === day && item.status === "Pagada");
  const upcoming = demo.appointments.filter((item) => item.branch === demo.branch && item.date >= day && item.status === "Reservada").sort((a, b) => a.date.localeCompare(b.date) || a.minute - b.minute).slice(0, 5);
  return <>
    <Heading title={panels ? "Paneles de resumen" : "Inicio"}/>
    <p className="panel-note">Diseño propio de MAMBO JAMBO · {day}</p>
    <Metrics items={[["Citas de hoy", appointments.length], ["Ventas de hoy", currency(sales.reduce((sum, item) => sum + saleTotal(item), 0))], ["Caja", openSession(demo) ? "Abierta" : "Cerrada"]]}/>
    <div className="library"><Link className="surface" href={href("agenda", { fecha: day })}>Agenda de hoy</Link><Link className="surface" href={href("agenda", { fecha: demoDate })}>Agenda de muestra</Link><Link className="surface" href={href("ventas/caja")}>Caja</Link><Link className="surface" href={href("informes")}>Informes</Link></div>
    <section className="surface v2-card"><h2>Próximas citas</h2><Rows columns={["Servicio", "Fecha", "Profesional"]} rows={upcoming.map((item) => ({ id: item.id, name: item.label, values: [item.date + " · " + time(item.minute), byId(demo.staff, item.staff)?.name], open: () => router.push(href("agenda", { cita: item.id, fecha: item.date, sucursal: item.branch })) }))}/></section>
  </>;
}

function Report({ route }: { route: string }) {
  const demo = useDemo();
  const { params, update } = useQuery();
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const [branch, setBranch] = useState(demo.branch);
  const [staff, setStaff] = useState("");
  const selected = params.get("ficha");
  const cut = todayAt(byId(demo.branches, branch)?.zone ?? demo.business.zone);
  const within = (date: string, location: string) => (!branch || branch === location) && (!from || date >= from) && (!until || date <= until);
  const member = (id: string) => !staff || staff === id;
  const appointments = demo.appointments.filter((item) => within(item.date, item.branch) && member(item.staff));
  const sales = demo.sales.filter((item) => within(item.date, item.branch) && member(item.staff) && item.status === "Pagada");
  const sessions = demo.sessions.filter((item) => within(item.openedAt.slice(0, 10), item.branch));
  const stockMoves = demo.stock.filter((item) => within(item.date, byId(demo.products, item.product)?.branch ?? ""));
  const earnings = demo.earnings.filter((item) => within(item.date, item.branch) && member(item.staff));
  let columns: string[];
  let records: { id: string; name: string; values: (string | number | undefined)[]; link?: string }[];
  let metrics: [string, string | number][];
  if (route.endsWith("citas")) {
    columns = ["Servicio", "Fecha", "Estado", "Profesional"];
    records = appointments.map((item) => ({ id: item.id, name: item.label, values: [item.date, item.status, byId(demo.staff, item.staff)?.name], link: href("agenda", { cita: item.id, fecha: item.date, sucursal: item.branch }) }));
    metrics = [["Citas", appointments.length], ["Reservadas", appointments.filter((item) => item.status === "Reservada").length], ["Completadas", appointments.filter((item) => item.status === "Completada").length], ["Canceladas", appointments.filter((item) => item.status === "Cancelada").length], ["Inasistencias", appointments.filter((item) => item.status === "Inasistencia").length]];
  } else if (route.endsWith("ventas")) {
    columns = ["Folio", "Total", "Artículo", "Propina", "Fecha"];
    records = sales.map((item) => ({ id: item.id, name: item.folio, values: [currency(saleTotal(item)), item.lines.map((line) => line.name).join(", "), currency(item.tip), item.date], link: href("ventas/nueva", { ficha: item.id }) }));
    metrics = [["Total cobrado", currency(sales.reduce((sum, item) => sum + saleTotal(item), 0))], ["Ventas pagadas", sales.length], ["Artículos", sales.reduce((sum, item) => sum + item.lines.reduce((a, line) => a + line.quantity, 0), 0)], ["Propinas", currency(sales.reduce((sum, item) => sum + item.tip, 0))]];
  } else if (route.endsWith("caja")) {
    const moves = demo.cash.filter((item) => sessions.some((session) => session.id === item.session));
    columns = ["Sesión", "Estado", "Esperado", "Diferencia"];
    records = sessions.map((item) => ({ id: item.id, name: new Date(item.openedAt).toLocaleString("es-MX"), values: [item.closedAt ? "Cerrada" : "Abierta", currency(cashFor(demo, item)), item.closedAt ? currency(item.counted! - item.expected!) : "—"], link: item.branch === demo.branch ? href("ventas/caja", { ficha: item.id }) : undefined }));
    metrics = [["Sesiones", sessions.length], ["Entradas", currency(moves.reduce((sum, item) => sum + Math.max(item.amount, 0), 0))], ["Salidas", currency(moves.reduce((sum, item) => sum + Math.max(-item.amount, 0), 0))], ["Cierres", sessions.filter((item) => item.closedAt).length], ["Diferencias", currency(sessions.reduce((sum, item) => sum + (item.closedAt ? item.counted! - item.expected! : 0), 0))]];
  } else if (route.endsWith("inventario")) {
    const products = demo.products.filter((item) => item.tracked && (!branch || item.branch === branch));
    columns = ["Movimiento", "Cantidad", "Producto", "Fecha"];
    records = stockMoves.map((item) => ({ id: item.id, name: item.kind, values: [item.delta, byId(demo.products, item.product)?.name, item.date], link: byId(demo.products, item.product)?.branch === demo.branch ? href("catalogo/inventario", { ficha: item.product }) : undefined }));
    metrics = [["Existencias actuales", products.reduce((sum, item) => sum + stockFor(demo, item.id), 0)], ["Movimientos", stockMoves.length], ["Recepciones", new Set(stockMoves.filter((item) => item.kind === "Recepción").map((item) => item.source)).size], ["Recuentos aplicados", stockMoves.filter((item) => item.kind === "Recuento").length]];
  } else {
    const payoutEntries = new Set(earnings.map((item) => item.id));
    const payouts = demo.payouts.filter((item) => item.entries.some((id) => payoutEntries.has(id)));
    columns = ["Profesional", "Citas", "Ventas", "Comisión", "Liquidaciones"];
    records = demo.staff.filter((item) => member(item.id) && (!branch || item.branches.includes(branch))).map((item) => ({ id: item.id, name: item.name, values: [appointments.filter((entry) => entry.staff === item.id).length, sales.filter((entry) => entry.staff === item.id).length, currency(earnings.filter((entry) => entry.staff === item.id).reduce((sum, entry) => sum + entry.commission, 0)), payouts.filter((entry) => entry.staff === item.id).length], link: href("equipo", { ficha: item.id }) }));
    metrics = [["Citas", appointments.length], ["Ventas", sales.length], ["Comisión neta", currency(earnings.reduce((sum, item) => sum + item.commission, 0))], ["Liquidaciones", payouts.length]];
  }
  const report = reportLinks.find((entry) => entry[1] === route)!;
  const detail = records.find((item) => item.id === selected);
  return <>
    <Heading title={"Informe de " + report[0].toLowerCase()}/>
    <div className="directory-toolbar">
      <label>Desde<input type="date" value={from} onChange={(event) => setFrom(event.target.value)}/></label>
      <label>Hasta<input type="date" value={until} onChange={(event) => setUntil(event.target.value)}/></label>
      <label>Sucursal<select value={branch} onChange={(event) => setBranch(event.target.value)}><option value="">Todas</option>{demo.branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      {!route.endsWith("inventario") && !route.endsWith("caja") && <label>Profesional<select value={staff} onChange={(event) => setStaff(event.target.value)}><option value="">Todos</option>{demo.staff.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
      <button className="button" onClick={() => { setFrom(""); setUntil(""); setBranch(demo.branch); setStaff(""); }}>Restablecer filtros</button>
    </div>
    <p className="panel-note">Fecha de corte {cut} · Datos de este navegador.</p>
    {from && until && from > until ? <p role="alert" className="error-box">La fecha inicial debe ser anterior o igual a la final.</p> : <>
      <Metrics items={metrics}/><Rows columns={columns} rows={records.map((item) => ({ ...item, open: () => update({ ficha: item.id }) }))}/>
    </>}
    {detail && <Panel title="Registro del informe" close={() => update({ ficha: null }, true)}><h3>{detail.name}</h3><Details fields={detail.values.map((value, index) => [columns[index + 1], value])}/>{detail.link && <div className="actions"><Link className="button" href={detail.link}>Abrir origen</Link></div>}</Panel>}
  </>;
}
