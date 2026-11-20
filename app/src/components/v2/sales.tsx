"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { href } from "../../lib/navigation";
import { useQuery } from "../../lib/query";
import { byId, cents, currency, saleTotal, stockFor, upsert, uuid, type Sale, type SaleLine } from "../../lib/v2/model";
import { checkout, newSale, voidSale } from "../../lib/v2/operations";
import { commit, useDemo } from "../../lib/v2/store";
import { Heading, Panel } from "../ui";
import { Action, Details, includes, Metrics, Rows, Search } from "./common";

export function Sales({ route }: { route: string }) {
  const demo = useDemo();
  const { params, update } = useQuery();
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const [status, setStatus] = useState("");
  const selected = byId(demo.sales, params.get("ficha") ?? "");
  const appointment = byId(demo.appointments, params.get("citaOrigen") ?? "");
  const currentSales = demo.sales.filter((item) => item.branch === demo.branch && (!from || item.date >= from) && (!until || item.date <= until) && (!status || item.status === status) && includes(item.folio + " " + (byId(demo.clients, item.client)?.name ?? ""), query));
  const paid = currentSales.filter((item) => item.status === "Pagada");
  if (route === "ventas/nueva") return <Pos key={(params.get("ficha") ?? params.get("citaOrigen") ?? "new") + (selected?.status ?? appointment?.id ?? "")} sale={selected} appointmentId={appointment?.id} invalid={Boolean(params.get("ficha") && !selected)}/>;
  const filters = <Search label="Buscar por folio o cliente" value={query} set={setQuery}>
    <label>Desde<input type="date" value={from} onChange={(event) => setFrom(event.target.value)}/></label><label>Hasta<input type="date" value={until} onChange={(event) => setUntil(event.target.value)}/></label>
    <label>Estado<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Todos</option>{["Borrador", "Pendiente de pago", "Pagada", "Anulada"].map((item) => <option key={item}>{item}</option>)}</select></label>
    <button className="button" onClick={() => { setFrom(""); setUntil(""); setStatus(""); setQuery(""); }}>Restablecer filtros</button>
  </Search>;
  const open = (id: string) => update({ ficha: id });
  const title = route.endsWith("borradores") ? "Borradores" : route.endsWith("resumen") ? "Resumen de ventas" : "Ventas";
  if (route === "ventas/citas") return <><Heading title="Citas vinculadas"/><Rows columns={["Cita", "Fecha", "Estado"]} rows={demo.appointments.filter((item) => item.branch === demo.branch).map((item) => ({ id: item.id, name: item.label, values: [item.date, item.status], open: () => update({ cita: item.id }) }))}/>{params.get("cita") && <div className="actions"><Link className="button" href={href("agenda", { cita: params.get("cita")!, fecha: byId(demo.appointments, params.get("cita")!)?.date ?? "" })}>Abrir cita en Agenda</Link>{!["Cancelada", "Inasistencia"].includes(byId(demo.appointments, params.get("cita")!)?.status ?? "") && <Link className="button primary" href={href("ventas/nueva", { citaOrigen: params.get("cita")! })}>Ver o preparar venta</Link>}</div>}</>;
  if (route === "ventas/pagos") return <><Heading title="Pagos"/>{filters}<Rows columns={["Pago", "Importe", "Método", "Fecha"]} rows={demo.payments.filter((item) => currentSales.some((sale) => sale.id === item.sale)).map((item) => ({ id: item.id, name: byId(demo.sales, item.sale)?.folio ?? item.sale, values: [currency(item.amount), "Efectivo simulado", item.date], open: () => open(item.sale) }))}/>{selected && <Receipt sale={selected} close={() => update({ ficha: null })}/>}</>;
  if (route === "ventas/articulos") return <><Heading title="Artículos vendidos"/>{filters}<Rows columns={["Artículo", "Cantidad", "Importe", "Folio"]} rows={paid.flatMap((item) => item.lines.map((line, index) => ({ id: item.id + index, name: line.name, values: [line.quantity, currency(line.quantity * line.unit), item.folio], open: () => open(item.id) })))}/>{selected && <Receipt sale={selected} close={() => update({ ficha: null })}/>}</>;
  const rows = currentSales.filter((item) => route === "ventas/borradores" ? ["Borrador", "Pendiente de pago"].includes(item.status) : ["Pagada", "Anulada"].includes(item.status));
  return <>
    <Heading title={title} action={<Link className="button primary" href={href("ventas/nueva")}>Nueva venta</Link>}/>
    {route === "ventas/resumen" && <Metrics items={[["Ventas pagadas", paid.length], ["Total cobrado", currency(paid.reduce((total, entry) => total + saleTotal(entry), 0))], ["Propinas", currency(paid.reduce((total, entry) => total + entry.tip, 0))]]}/>}
    {filters}
    <Rows columns={["Folio", "Total", "Fecha", "Estado", "Método"]} rows={rows.map((item) => ({ id: item.id, name: item.folio, values: [currency(saleTotal(item)), item.date, item.status, demo.payments.some((payment) => payment.sale === item.id) ? "Efectivo simulado" : "—"], open: () => open(item.id) }))}/>
    {selected && <Receipt sale={selected} close={() => update({ ficha: null })}/>}
  </>;
}


function Receipt({ sale, close }: { sale: Sale; close?: () => void }) {
  const demo = useDemo();
  const payment = demo.payments.find((item) => item.sale === sale.id);
  const appointment = byId(demo.appointments, sale.appointment);
  const content = <>
    <div className="detail-hero"><span className="status-chip">{sale.status}</span><h3>{sale.folio}</h3><p>Recibo de demostración · {sale.date}</p></div>
    <Details fields={[
      ...sale.lines.map((line, index): [string, string] => [`${index + 1}. ${line.quantity} × ${line.name}`, currency(line.unit * line.quantity)]),
      ["Propina", currency(sale.tip)], ["Total", currency(saleTotal(sale))],
      ...(payment ? [["Efectivo recibido", currency(payment.received)], ["Cambio", currency(payment.change)], ["Método", "Efectivo simulado"]] as [string, string][] : []),
    ]}/>
    <div className="actions">
      {appointment && <Link className="button" href={href("agenda", { cita: appointment.id, fecha: appointment.date, sucursal: appointment.branch })}>Volver a la cita</Link>}
      {["Borrador", "Pendiente de pago"].includes(sale.status) && <Link className="button primary" href={href("ventas/nueva", { ficha: sale.id })}>Continuar venta</Link>}
      {sale.status !== "Anulada" && <Action label="Anular venta" confirmation="¿Anular la venta y registrar los ajustes de demostración que correspondan?" run={() => commit((current) => voidSale(current, sale))}/>}
    </div>
  </>;
  return close ? <Panel title="Detalle de venta" close={close}>{content}</Panel> : <div className="surface v2-card">{content}</div>;
}

function Pos({ sale, appointmentId, invalid }: { sale?: Sale; appointmentId?: string; invalid: boolean }) {
  const demo = useDemo();
  const { update } = useQuery();
  const appointment = byId(demo.appointments, appointmentId ?? "");
  const existing = sale ?? (appointment && demo.sales.find((item) => item.appointment === appointment.id && item.status !== "Anulada"));
  const [draft, setDraft] = useState<Sale>(() => existing ?? newSale(demo, appointment, ""));
  const stagedId = useRef("");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<"service" | "product">("service");
  const [received, setReceived] = useState("");
  const [problem, setProblem] = useState("");
  const total = saleTotal(draft);
  if (invalid || (appointmentId && (!appointment || (!existing && ["Cancelada", "Inasistencia"].includes(appointment.status))))) return <><Heading title="Venta no disponible"/><Link className="button" href={href("ventas")}>Volver a Ventas</Link></>;
  if (existing && ["Pagada", "Anulada"].includes(existing.status)) return <><Heading title="Detalle de venta"/><Receipt sale={existing}/><Link className="button" href={href("ventas")}>Ver ventas</Link></>;
  const products = demo.products.filter((item) => item.branch === draft.branch && !item.archived);
  const offerings = demo.services.filter((item) => item.branches.includes(draft.branch) && !item.archived);
  const available = kind === "service"
    ? offerings.map((item) => ({ ...item, unit: Math.round(item.price * 100), detail: item.duration + " min", available: true }))
    : products.map((item) => ({ ...item, unit: item.price, detail: item.tracked ? stockFor(demo, item.id) + " disponibles" : "Sin seguimiento", available: !item.tracked || stockFor(demo, item.id) > 0 }));
  function add(line: SaleLine) {
    setDraft((value) => {
      const previous = value.lines.find((item) => item.item === line.item && item.kind === line.kind);
      return { ...value, lines: previous ? value.lines.map((item) => item === previous ? { ...item, quantity: item.quantity + 1 } : item) : [...value.lines, line] };
    });
  }
  function save(status: Sale["status"], pay = false) {
    setProblem("");
    try {
      let id = draft.id || existing?.id || stagedId.current || uuid();
      stagedId.current = id;
      commit((current) => {
        const durable = newSale(current, appointment, id);
        id = durable.id;
        const currentDraft = byId(current.sales, id);
        if (currentDraft && ["Pagada", "Anulada"].includes(currentDraft.status)) return current;
        const next = { ...draft, id, folio: currentDraft?.folio ?? durable.folio, status };
        const staged = { ...current, sales: upsert(current.sales, next) };
        return pay ? checkout(staged, id, cents(received)) : staged;
      });
      update({ ficha: id, citaOrigen: null }, true);
    } catch (error) { setProblem((error as Error).message); }
  }
  return <>
    <Heading title="Nueva venta"/>
    <div className="pos-layout">
      <section className="surface v2-card"><h2>Catálogo</h2>
        <div className="segmented" role="group" aria-label="Tipo de artículo"><button aria-pressed={kind === "service"} onClick={() => setKind("service")}>Servicios</button><button aria-pressed={kind === "product"} onClick={() => setKind("product")}>Productos</button></div>
        <Search label="Buscar artículos" value={search} set={setSearch}/>
        {available.filter((item) => includes(item.name, search)).map((item) => <div className="line-item" key={item.id}><div><strong>{item.name}</strong><p>{item.detail} · {currency(item.unit)}</p></div><button className="button" aria-label={"Agregar " + item.name} disabled={!item.available} onClick={() => add({ kind, item: item.id, name: item.name, quantity: 1, unit: item.unit })}>Agregar</button></div>)}
      </section>
      <section className="surface v2-card"><h2>Carrito</h2>
        {appointment && <p>Cita de origen · {appointment.label} · {appointment.date}</p>}
        {!draft.lines.length && <p>Elige un servicio o producto.</p>}
        {draft.lines.map((line, index) => <div className="line-item" key={line.kind + line.item}><div><strong>{line.name}</strong><p>{currency(line.unit)} por unidad</p></div><div><label>Cantidad<input aria-label={"Cantidad de " + line.name} type="number" min={1} max={10000} value={line.quantity} onChange={(event) => {
          const quantity = Number(event.target.value);
          if (Number.isInteger(quantity) && quantity >= 1 && quantity <= 10000) setDraft({ ...draft, lines: draft.lines.map((item, i) => i === index ? { ...item, quantity } : item) });
        }}/></label><button className="text-button" onClick={() => setDraft({ ...draft, lines: draft.lines.filter((_, i) => i !== index) })}>Quitar</button></div></div>)}
        <form className="v2-form" onSubmit={(event) => { event.preventDefault(); save("Pendiente de pago", true); }}>
          <label>Cliente<select value={draft.client} onChange={(event) => setDraft({ ...draft, client: event.target.value })}><option value="">Sin cliente</option>{demo.clients.filter((item) => !item.archived || item.id === draft.client).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Profesional<select value={draft.staff} onChange={(event) => setDraft({ ...draft, staff: event.target.value })}><option value="">Sin profesional</option>{demo.staff.filter((item) => item.branches.includes(draft.branch) && !item.archived).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label>Propina (MXN)<input type="number" min={0} step=".01" value={draft.tip / 100} onChange={(event) => { const value = cents(event.target.value); if (value >= 0 && Number.isSafeInteger(value)) setDraft({ ...draft, tip: value }); }}/></label>
          <Details fields={[["Subtotal", currency(total - draft.tip)], ["Total", currency(total)], ["Cambio", currency(Math.max(0, cents(received) - total))]]}/>
          <label>Efectivo recibido (MXN)<input type="number" min={0} step=".01" value={received} onChange={(event) => setReceived(event.target.value)} required/></label>
          {problem && <p className="error-box" role="alert">{problem}</p>}
          <div className="actions"><button type="button" className="button" onClick={() => save("Borrador")}>Guardar borrador</button><button type="button" className="button" onClick={() => save("Pendiente de pago")}>Dejar pendiente</button><button className="button primary" disabled={!draft.lines.length}>Confirmar efectivo simulado</button></div>
        </form>
      </section>
    </div>
  </>;
}
