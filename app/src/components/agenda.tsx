"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Plus, UsersRound, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { demoDate, formatDate, monday, moveDate, time, validDate } from "../lib/demo";
import Link from "next/link";
import { href } from "../lib/navigation";
import { byId, currency, todayAt, upsert, uuid, type DemoAppointment as Appointment, type Status } from "../lib/v2/model";
import { commit, useDemo } from "../lib/v2/store";
import { schedule } from "../lib/v2/operations";
import { Action } from "./v2/common";
import { useQuery } from "../lib/query";
import { Avatar, Empty, Heading, Panel } from "./ui";

const views = [{ id: "dia", label: "Día" }, { id: "semana", label: "Semana" }, { id: "lista", label: "Lista" }] as const;
const defaultOpening = 9 * 60;
const defaultClosing = 18 * 60;
export function Agenda() {
  const { params, update } = useQuery();
  const [compact, setCompact] = useState(false);
  const demo = useDemo();
  const { clients, appointments } = demo;
  const allStaff = demo.staff.filter((item) => item.branches.includes(demo.branch));
  const staff = allStaff.filter((item) => !item.archived);
  const zone = byId(demo.branches, demo.branch)?.zone ?? demo.business.zone;
  const shifts = demo.shifts.filter((item) => item.branch === demo.branch);
  const branchAppointments = appointments.filter((item) => item.branch === demo.branch);
  const opening = Math.floor(Math.min(defaultOpening, ...shifts.map((item) => item.start), ...branchAppointments.map((item) => item.minute)) / 60) * 60;
  const closing = Math.ceil(Math.max(defaultClosing, ...shifts.map((item) => item.end), ...branchAppointments.map((item) => item.minute + item.duration)) / 60) * 60;
  const slots = Array.from({ length: (closing - opening) / 15 }, (_, index) => opening + index * 15);
  const position = (minute: number) => (minute - opening) / (closing - opening) * 100;
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<Appointment | null>(null);
  const focusAfterSave = useRef<string | null>(null);
  const rawDate = params.get("fecha");
  const date = validDate(rawDate) ? rawDate : demoDate;
  const view = views.find((item) => item.id === params.get("vista"))?.id ?? (compact ? "lista" : "dia");
  const member = staff.find((person) => person.id === params.get("empleado"));
  const weekMember = member ?? staff[0];
  const weekStart = monday(date);
  const week = Array.from({ length: 7 }, (_, index) => moveDate(weekStart, index));
  const filtered = branchAppointments.filter((event) => view === "semana"
    ? week.includes(event.date) && event.staff === weekMember?.id
    : event.date === date && (!member || event.staff === member.id));
  const selected = params.get("cita");
  const isNew = selected === "nueva";
  const active = branchAppointments.find((event) => event.id === selected);
  const editing = active && params.get("editar") === "1";
  const close = () => { setPreview(null); update({ cita: null, franja: null, persona: null, editar: null, cliente: null }, true); };
  const open = (id: string) => { setNotice(""); update({ cita: id, franja: null, persona: null }); };

  useEffect(() => {
    const media = matchMedia("(max-width: 600px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const id = focusAfterSave.current;
    if (selected || !id) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(id)?.focus();
      focusAfterSave.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);

  function add(eventDate = date, minute = opening, employee = (view === "semana" ? weekMember : member ?? staff[0])?.id ?? "") {
    setNotice("");
    setPreview(null);
    update({ cita: "nueva", fecha: eventDate, franja: String(minute), persona: employee });
  }

  const requestedSlot = Number(params.get("franja"));
  const draft: Appointment = editing ? active : {
    id: "", date, minute: slots.includes(requestedSlot) ? requestedSlot : opening,
    staff: staff.find((person) => person.id === params.get("persona"))?.id ?? member?.id ?? staff[0]?.id ?? "",
    service: "", client: byId(clients, params.get("cliente") ?? "")?.id ?? "", branch: demo.branch, duration: 30, price: 0, label: "", status: "Reservada", notes: "", history: [],
  };
  const provisional = preview ?? draft;
  const dates = view === "semana" ? week : [date];
  const columns = view === "semana"
    ? (weekMember ? week.map((day) => ({ person: weekMember, day })) : [])
    : (member ? [member] : staff).map((person) => ({ person, day: date }));
  const period = view === "semana"
    ? `${formatDate(weekStart, { day: "numeric", month: "short" })} – ${formatDate(week[6], { day: "numeric", month: "short", year: "numeric" })}`
    : formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const subtype = view === "semana" ? "Semana de trabajo" : view === "lista" ? "Citas del día" : "Calendario del día";
  const count = `${filtered.length} ${filtered.length === 1 ? "cita" : "citas"}`;

  return <>
    <Heading title="Agenda" action={<button className="button primary" disabled={!staff.length} onClick={() => add()}><Plus size={18}/> Nueva cita</button>}/>
    <section aria-label="Calendario de citas" className="agenda">
      <div className="agenda-controls">
        <div className="period-controls">
          <button className="button small" onClick={() => update({ fecha: todayAt(zone) })}>Hoy</button>
          <div className="stepper">
            <button className="icon-button" aria-label="Período anterior" onClick={() => update({ fecha: moveDate(date, view === "semana" ? -7 : -1) })}><ChevronLeft size={18}/></button>
            <button className="icon-button" aria-label="Período siguiente" onClick={() => update({ fecha: moveDate(date, view === "semana" ? 7 : 1) })}><ChevronRight size={18}/></button>
          </div>
          <label className="date-control" title="Seleccionar fecha"><CalendarDays size={17}/><span>{formatDate(date, { day: "numeric", month: "short" })}</span><ChevronDown size={14}/><input aria-label="Fecha de agenda" type="date" value={date} lang="es-MX" onChange={(event) => { if (validDate(event.target.value)) update({ fecha: event.target.value }); }}/></label>
        </div>
        <div className="display-controls">
          <label className="select-control"><UsersRound size={17}/><select aria-label="Empleado" value={view === "semana" ? weekMember?.id ?? "" : member?.id ?? ""} onChange={(event) => update({ empleado: event.target.value || null })}>
            {view !== "semana" && <option value="">Todo el equipo</option>}
            {staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select><ChevronDown size={14}/></label>
          <div className="segmented" role="group" aria-label="Vista de agenda">{views.map((item) => <button key={item.id} aria-pressed={view === item.id} onClick={() => update({ vista: item.id })}>{item.label}</button>)}</div>
        </div>
      </div>
      <div className="surface calendar-surface">
        <header className="calendar-heading"><div><p>{subtype}</p><h2>{period}</h2></div><span className="count"><span/>{count}</span></header>
        {filtered.some((event) => event.status !== "Reservada") && <div className="status-breakdown">{(["Reservada", "Completada", "Cancelada", "Inasistencia"] as Status[]).map((status) => {
          const count = filtered.filter((event) => event.status === status).length;
          return count > 0 && <span key={status}>{status} · {count}</span>;
        })}</div>}
        {staff.length === 0 ? <Empty title="Sin profesionales en esta sucursal" description="Asigna un miembro y configura su turno en Equipo." action={<Link className="button" href={href("equipo")}>Ver equipo</Link>}/> : view === "lista" ? (
          filtered.length ? <ul className="agenda-list">{[...filtered].sort((a, b) => a.minute - b.minute).map((event) => {
            const service = { name: event.label, duration: event.duration, price: event.price };
            const person = byId(demo.staff, event.staff)!;
            return <li key={event.id}><button id={event.id} className="list-event" onClick={() => open(event.id)}>
              <span className="list-time">{time(event.minute)}<small>{time(event.minute + service.duration)}</small></span>
              <span className={`event-mark ${person.tone}`}/>
              <span className="list-info"><strong>{clients.find((item) => item.id === event.client)?.name ?? "Sin cliente"}</strong><small>{service.name} · {person.name} · {event.status}</small></span><ChevronRight size={17}/>
            </button></li>;
          })}</ul> : <Empty title="No hay citas en este día" description="Cambia la fecha o añade una cita de demostración." action={<button className="button" onClick={() => update({ fecha: demoDate })}>Ver día de muestra</button>}/>
        ) : <>
          {filtered.length === 0 && <div className="calendar-empty"><span>No hay citas para este período.</span><button className="text-button" onClick={() => update({ fecha: demoDate })}>Ver día de muestra</button></div>}
          <div className="calendar-scroll"><div className={`calendar-grid ${view === "semana" ? "week" : ""}`} style={{ "--columns": columns.length, "--slots": slots.length } as CSSProperties}>
            <div className="timezone-label">Hora</div>
            {columns.map(({ person, day }) => <div className={`column-heading ${view === "semana" && day === date ? "selected-day" : ""}`} key={day + person.id}>
              {view === "semana" ? <><small>{formatDate(day, { weekday: "short" })}</small><strong>{formatDate(day, { day: "numeric" })}</strong></> : <><Avatar name={person.name} tone={person.tone}/><span><strong>{person.name}</strong><small>{person.role}</small></span></>}
            </div>)}
            <div className="hours">{slots.filter((minute) => minute % 60 === 0).map((minute) => <span key={minute} style={{ top: `${position(minute)}%` }}>{time(minute)}</span>)}</div>
            {columns.map(({ person, day }) => <div className="time-column" key={day + person.id}>
              {slots.map((minute) => {
                const busy = filtered.some((event) => event.status === "Reservada" && event.staff === person.id && event.date === day && minute >= event.minute && minute < event.minute + event.duration);
                return <button key={minute} tabIndex={minute % 60 === 0 && !busy ? 0 : -1} disabled={busy} aria-label={`Nueva cita: ${person.name}, ${formatDate(day, { day: "numeric", month: "short" })}, ${time(minute)}`} className="slot" onClick={() => add(day, minute, person.id)}><Plus size={13}/></button>;
              })}
              {filtered.filter((event) => event.staff === person.id && event.date === day && event.status !== "Cancelada").map((event) => {
                const service = { name: event.label, duration: event.duration, price: event.price };
                const name = clients.find((item) => item.id === event.client)?.name ?? "Sin cliente";
                return <button key={event.id} id={event.id} className={`appointment ${person.tone} ${selected === event.id ? "active" : ""}`} style={{ top: `${position(event.minute)}%`, height: `calc(${position(opening + service.duration)}% - 3px)` }} aria-label={`${name}, ${service.name}, ${time(event.minute)}`} onClick={() => open(event.id)}>
                  <span>{time(event.minute)}–{time(event.minute + service.duration)}</span><strong>{name}</strong><small>{service.name} · {event.status}</small>
                </button>;
              })}
              {(isNew || editing) && provisional.date === day && provisional.staff === person.id && <div className="provisional" style={{ top: `${position(provisional.minute)}%` }}>Franja provisional</div>}
            </div>)}
          </div></div>
        </>}
        <footer className="calendar-footer"><span><Clock3 size={14}/> {zone}</span>{dates.includes(demoDate) && <span>Agenda de muestra</span>}</footer>
      </div>
    </section>
    <div className="status-region" role="status">{notice && <div className="toast"><CheckCircle2 size={19}/>{notice}<button className="text-button" onClick={() => setNotice("")}>Cerrar</button></div>}</div>
    {(isNew || editing) && <AppointmentEditor key={draft.id || "new"} initial={draft} close={close} onPreview={setPreview} save={(event) => {
      focusAfterSave.current = event.id;
      commit((current) => schedule(current, event));
      setNotice(editing ? "Cita actualizada." : "Cita de demostración añadida.");
      setPreview(null);
      const visibleEmployee = view === "semana" || (member && member.id !== event.staff) ? event.staff : member?.id ?? null;
      update({ fecha: event.date, empleado: visibleEmployee, cita: null, franja: null, persona: null, editar: null, cliente: null }, true);
    }}/>}
    {active && !editing && <AppointmentDetails event={active} close={close} edit={() => update({ editar: "1" })}/>}
    {selected && !active && !isNew && <Panel close={close} title="Cita no disponible"><Empty title="No se encontró la cita" description="Comprueba que la cita corresponda a la sucursal activa." action={<button className="button" onClick={close}>Volver a la agenda</button>}/></Panel>}
  </>;
}

function AppointmentDetails({ event, close, edit }: { event: Appointment; close: () => void; edit: () => void }) {
  const demo = useDemo();
  const person = byId(demo.staff, event.staff)!;
  const client = byId(demo.clients, event.client);
  const sale = demo.sales.find((item) => item.appointment === event.id && item.status !== "Anulada");
  function change(status: Status) {
    commit((current) => {
      const existing = byId(current.appointments, event.id);
      if (!existing || existing.status !== "Reservada") return current;
      return { ...current, appointments: upsert(current.appointments, { ...existing, status, history: [...existing.history, status + " · " + new Date().toLocaleString("es-MX")] }) };
    });
  }
  return <Panel title="Detalle de cita" close={close} footer={<button className="button" onClick={close}>Volver a la agenda</button>}>
    <div className="detail-hero"><span className="status-chip"><span/>{event.status}</span><h3>{client?.name ?? "Sin cliente"}</h3><p>{formatDate(event.date, { dateStyle: "full" })}</p></div>
    <dl className="detail-list">
      <div><dt>Horario</dt><dd>{time(event.minute)}–{time(event.minute + event.duration)}</dd></div>
      <div><dt>Servicio</dt><dd>{event.label}</dd></div>
      <div><dt>Profesional</dt><dd><Avatar name={person.name} tone={person.tone}/>{person.name}</dd></div>
      <div><dt>Duración</dt><dd>{event.duration} min</dd></div>
      <div><dt>Total estimado</dt><dd>{currency(Math.round(event.price * 100))}</dd></div>
      <div><dt>Notas</dt><dd>{event.notes || "—"}</dd></div>
    </dl>
    <div className="actions">
      {event.status === "Reservada" && <><button className="button" onClick={edit}>Editar o reprogramar</button><Action label="Cancelar cita" confirmation="¿Cancelar y liberar esta franja?" run={() => change("Cancelada")}/><Action label="Marcar completada" run={() => change("Completada")}/><Action label="Marcar inasistencia" run={() => change("Inasistencia")}/></>}
      {client && <Link className="button" href={href("clientes", { ficha: client.id })}>Ficha del cliente</Link>}
      {sale ? <Link className="button primary" href={href("ventas/nueva", { ficha: sale.id })}>Ver venta</Link> : !["Cancelada", "Inasistencia"].includes(event.status) && <Link className="button primary" href={href("ventas/nueva", { citaOrigen: event.id, sucursal: event.branch })}>Cobrar cita</Link>}
    </div>
    <h3>Historial de demostración</h3><ul className="history">{event.history.map((entry, index) => <li key={index}>{entry}</li>)}</ul>
  </Panel>;
}

function AppointmentEditor({ initial, close, save, onPreview }: { initial: Appointment; close: () => void; save: (event: Appointment) => void; onPreview: (event: Appointment) => void }) {
  const demo = useDemo();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const staff = demo.staff.filter((member) => !member.archived && member.branches.includes(draft.branch));
  const service = byId(demo.services, draft.service);
  const eligible = demo.services.filter((item) => (!item.archived || (initial.id && initial.service === item.id)) && item.branches.includes(draft.branch) && item.staff.includes(draft.staff));
  const usesSnapshot = initial.id && initial.service === draft.service;
  const price = usesSnapshot ? initial.price : service?.price ?? 0;
  const duration = usesSnapshot ? initial.duration : service?.duration ?? 0;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!service) return;
    try {
      save({ ...draft, id: initial.id || uuid(), duration, price, label: usesSnapshot ? initial.label : service.name, history: [...initial.history, (initial.id ? "Cita editada" : "Cita creada") + " · " + new Date().toLocaleString("es-MX")] });
    } catch (failure) { setError((failure as Error).message); }
  }
  function change(fields: Partial<Appointment>) {
    setError("");
    const next = { ...draft, ...fields };
    setDraft(next);
    onPreview(next);
  }
  function cancel() {
    if (draft === initial || window.confirm("¿Descartar los cambios de esta cita de prueba?")) close();
  }
  return <Panel close={cancel} title={initial.id ? "Editar cita" : "Nueva cita"} footer={<><button className="button" onClick={cancel}>Cancelar</button><button className="button primary" form="appointment-form" type="submit">{initial.id ? "Guardar cambios" : "Añadir cita de prueba"}</button></>}>
    <form id="appointment-form" className="editor" onSubmit={submit}>
      <fieldset>
        <legend>Horario y servicio</legend>
        <div className="form-pair"><label>Fecha<input type="date" required value={draft.date} onChange={(event) => change({ date: event.target.value })}/></label>
        <label>Hora<input type="time" required value={time(draft.minute)} onChange={(event) => {const [hour, minute] = event.target.value.split(":").map(Number); if (Number.isFinite(hour * 60 + minute)) change({ minute: hour * 60 + minute });}}/></label></div>
        <label>Profesional<select required value={draft.staff} onChange={(event) => change({ staff: event.target.value, service: "" })}><option value="">Seleccionar profesional</option>{staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
        <label>Servicio<select required value={draft.service} onChange={(event) => change({ service: event.target.value })}><option value="">Seleccionar servicio</option>{eligible.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.duration} min</option>)}</select></label>
        <label>Cliente (opcional)<select value={draft.client} onChange={(event) => change({ client: event.target.value })}><option value="">Sin cliente</option>{demo.clients.filter((client) => !client.archived || client.id === initial.client).map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
        <label>Notas<input value={draft.notes} onChange={(event) => change({ notes: event.target.value })}/></label>
        {!initial.id && <label>Estado inicial<select value={draft.status} onChange={(event) => change({ status: event.target.value as Status })}><option>Reservada</option><option>Completada</option></select></label>}
      </fieldset>
      {error && <p className="error-box" role="alert">{error}</p>}
    </form>
    {service && <div className="editor-total"><span>{duration} min · Total</span><strong>{currency(Math.round(price * 100))}</strong></div>}
  </Panel>;
}
