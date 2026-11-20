"use client";

import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Clock3, Plus, UsersRound, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { clients, demoAppointments, demoDate, formatDate, monday, money, moveDate, services, staff, time, today, validDate, type Appointment } from "../lib/demo";
import { useQuery } from "../lib/query";
import { Avatar, Empty, Heading, Panel } from "./ui";

const views = [{ id: "dia", label: "Día" }, { id: "semana", label: "Semana" }, { id: "lista", label: "Lista" }] as const;
const opening = 9 * 60;
const closing = 18 * 60;
const slots = Array.from({ length: (closing - opening) / 15 }, (_, index) => opening + index * 15);
const position = (minute: number) => (minute - opening) / (closing - opening) * 100;
const durationOf = (event: Appointment) => services.find((service) => service.id === event.service)!.duration;

export function Agenda() {
  const { params, update } = useQuery();
  const [compact, setCompact] = useState(false);
  const [appointments, setAppointments] = useState(demoAppointments);
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
  const filtered = appointments.filter((event) => view === "semana"
    ? week.includes(event.date) && event.staff === weekMember.id
    : event.date === date && (!member || event.staff === member.id));
  const selected = params.get("cita");
  const isNew = selected === "nueva";
  const active = appointments.find((event) => event.id === selected);
  const close = () => { setPreview(null); update({ cita: null, franja: null, persona: null }, true); };
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

  function add(eventDate = date, minute = opening, employee = (view === "semana" ? weekMember : member ?? staff[0]).id) {
    setNotice("");
    setPreview(null);
    update({ cita: "nueva", fecha: eventDate, franja: String(minute), persona: employee });
  }

  const requestedSlot = Number(params.get("franja"));
  const draft: Appointment = {
    id: "", date, minute: slots.includes(requestedSlot) ? requestedSlot : opening,
    staff: staff.find((person) => person.id === params.get("persona"))?.id ?? member?.id ?? staff[0].id,
    service: "", client: "",
  };
  const provisional = preview ?? draft;
  const dates = view === "semana" ? week : [date];
  const columns = view === "semana"
    ? week.map((day) => ({ person: weekMember, day }))
    : (member ? [member] : staff).map((person) => ({ person, day: date }));
  const period = view === "semana"
    ? `${formatDate(weekStart, { day: "numeric", month: "short" })} – ${formatDate(week[6], { day: "numeric", month: "short", year: "numeric" })}`
    : formatDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const subtype = view === "semana" ? "Semana de trabajo" : view === "lista" ? "Citas del día" : "Calendario del día";
  const count = `${filtered.length} ${filtered.length === 1 ? "cita" : "citas"}`;

  return <>
    <Heading title="Agenda" action={<button className="button primary" onClick={() => add()}><Plus size={18}/> Nueva cita</button>}/>
    <section aria-label="Calendario de citas" className="agenda">
      <div className="agenda-controls">
        <div className="period-controls">
          <button className="button small" onClick={() => update({ fecha: today() })}>Hoy</button>
          <div className="stepper">
            <button className="icon-button" aria-label="Período anterior" onClick={() => update({ fecha: moveDate(date, view === "semana" ? -7 : -1) })}><ChevronLeft size={18}/></button>
            <button className="icon-button" aria-label="Período siguiente" onClick={() => update({ fecha: moveDate(date, view === "semana" ? 7 : 1) })}><ChevronRight size={18}/></button>
          </div>
          <label className="date-control" title="Seleccionar fecha"><CalendarDays size={17}/><span>{formatDate(date, { day: "numeric", month: "short" })}</span><ChevronDown size={14}/><input aria-label="Fecha de agenda" type="date" value={date} lang="es-MX" onChange={(event) => { if (validDate(event.target.value)) update({ fecha: event.target.value }); }}/></label>
        </div>
        <div className="display-controls">
          <label className="select-control"><UsersRound size={17}/><select aria-label="Empleado" value={view === "semana" ? weekMember.id : member?.id ?? ""} onChange={(event) => update({ empleado: event.target.value || null })}>
            {view !== "semana" && <option value="">Todo el equipo</option>}
            {staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select><ChevronDown size={14}/></label>
          <div className="segmented" role="group" aria-label="Vista de agenda">{views.map((item) => <button key={item.id} aria-pressed={view === item.id} onClick={() => update({ vista: item.id })}>{item.label}</button>)}</div>
        </div>
      </div>
      <div className="surface calendar-surface">
        <header className="calendar-heading"><div><p>{subtype}</p><h2>{period}</h2></div><span className="count"><span/>{count}</span></header>
        {view === "lista" ? (
          filtered.length ? <ul className="agenda-list">{[...filtered].sort((a, b) => a.minute - b.minute).map((event) => {
            const service = services.find((item) => item.id === event.service)!;
            const person = staff.find((item) => item.id === event.staff)!;
            return <li key={event.id}><button id={event.id} className="list-event" onClick={() => open(event.id)}>
              <span className="list-time">{time(event.minute)}<small>{time(event.minute + service.duration)}</small></span>
              <span className={`event-mark ${person.tone}`}/>
              <span className="list-info"><strong>{clients.find((item) => item.id === event.client)?.name ?? "Sin cliente"}</strong><small>{service.name} · {person.name}</small></span><ChevronRight size={17}/>
            </button></li>;
          })}</ul> : <Empty title="No hay citas en este día" description="Cambia la fecha o añade una cita de demostración." action={<button className="button" onClick={() => update({ fecha: demoDate })}>Ver día de muestra</button>}/>
        ) : <>
          {filtered.length === 0 && <div className="calendar-empty"><span>No hay citas para este período.</span><button className="text-button" onClick={() => update({ fecha: demoDate })}>Ver día de muestra</button></div>}
          <div className="calendar-scroll"><div className={`calendar-grid ${view === "semana" ? "week" : ""}`} style={{ "--columns": columns.length } as CSSProperties}>
            <div className="timezone-label">GMT−6</div>
            {columns.map(({ person, day }) => <div className={`column-heading ${view === "semana" && day === date ? "selected-day" : ""}`} key={day + person.id}>
              {view === "semana" ? <><small>{formatDate(day, { weekday: "short" })}</small><strong>{formatDate(day, { day: "numeric" })}</strong></> : <><Avatar name={person.name} tone={person.tone}/><span><strong>{person.name}</strong><small>{person.role}</small></span></>}
            </div>)}
            <div className="hours">{slots.filter((minute) => minute % 60 === 0).map((minute) => <span key={minute} style={{ top: `${position(minute)}%` }}>{time(minute)}</span>)}</div>
            {columns.map(({ person, day }) => <div className="time-column" key={day + person.id}>
              {slots.map((minute) => {
                const busy = filtered.some((event) => event.staff === person.id && event.date === day && minute >= event.minute && minute < event.minute + durationOf(event));
                return <button key={minute} tabIndex={minute % 60 === 0 && !busy ? 0 : -1} disabled={busy} aria-label={`Nueva cita: ${person.name}, ${formatDate(day, { day: "numeric", month: "short" })}, ${time(minute)}`} className="slot" onClick={() => add(day, minute, person.id)}><Plus size={13}/></button>;
              })}
              {filtered.filter((event) => event.staff === person.id && event.date === day).map((event) => {
                const service = services.find((item) => item.id === event.service)!;
                const name = clients.find((item) => item.id === event.client)?.name ?? "Sin cliente";
                return <button key={event.id} id={event.id} className={`appointment ${person.tone} ${selected === event.id ? "active" : ""}`} style={{ top: `${position(event.minute)}%`, height: `calc(${position(opening + service.duration)}% - 3px)` }} aria-label={`${name}, ${service.name}, ${time(event.minute)}`} onClick={() => open(event.id)}>
                  <span>{time(event.minute)}–{time(event.minute + service.duration)}</span><strong>{name}</strong><small>{service.name}</small>
                </button>;
              })}
              {isNew && provisional.date === day && provisional.staff === person.id && <div className="provisional" style={{ top: `${position(provisional.minute)}%` }}>Franja provisional</div>}
            </div>)}
          </div></div>
        </>}
        <footer className="calendar-footer"><span><Clock3 size={14}/> Hora de Ciudad de México</span>{dates.includes(demoDate) && <span>Agenda de muestra</span>}</footer>
      </div>
    </section>
    <div className="status-region" role="status">{notice && <div className="toast"><CheckCircle2 size={19}/>{notice}<button className="text-button" onClick={() => setNotice("")}>Cerrar</button></div>}</div>
    {isNew && <AppointmentEditor initial={draft} close={close} appointments={appointments} onPreview={setPreview} save={(event) => {
      focusAfterSave.current = event.id;
      setAppointments((previous) => [...previous, event]);
      setNotice("Cita de demostración añadida.");
      setPreview(null);
      const visibleEmployee = view === "semana" || (member && member.id !== event.staff) ? event.staff : member?.id ?? null;
      update({ fecha: event.date, empleado: visibleEmployee, cita: null, franja: null, persona: null }, true);
    }}/>}
    {active && <AppointmentDetails event={active} close={close}/>}
    {selected && !active && !isNew && <Panel close={close} title="Cita no disponible"><Empty title="No se encontró la cita" description="Las citas de demostración nuevas desaparecen al salir de la Agenda." action={<button className="button" onClick={close}>Volver a la agenda</button>}/></Panel>}
  </>;
}

function AppointmentDetails({ event, close }: { event: Appointment; close: () => void }) {
  const person = staff.find((item) => item.id === event.staff)!;
  const service = services.find((item) => item.id === event.service)!;
  return <Panel title="Detalle de cita" close={close} footer={<button className="button" onClick={close}>Volver a la agenda</button>}>
    <div className="detail-hero"><span className="status-chip"><span/>Reservada</span><h3>{clients.find((client) => client.id === event.client)?.name ?? "Sin cliente"}</h3><p>{formatDate(event.date, { dateStyle: "full" })}</p></div>
    <dl className="detail-list">
      <div><dt>Horario</dt><dd>{time(event.minute)}–{time(event.minute + service.duration)}</dd></div>
      <div><dt>Servicio</dt><dd>{service.name}</dd></div>
      <div><dt>Profesional</dt><dd><Avatar name={person.name} tone={person.tone}/>{person.name}</dd></div>
      <div><dt>Duración</dt><dd>{service.duration} min</dd></div>
      <div><dt>Total estimado</dt><dd>{money(service.price)} MXN</dd></div>
    </dl>
    <p className="panel-note">Registro ficticio para revisión visual.</p>
  </Panel>;
}

function AppointmentEditor({ initial, appointments, close, save, onPreview }: { initial: Appointment; appointments: Appointment[]; close: () => void; save: (event: Appointment) => void; onPreview: (event: Appointment) => void }) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const service = services.find((item) => item.id === draft.service);
  const eligible = services.filter((item) => item.staff.includes(draft.staff));
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !service) return;
    setError("");
    const end = draft.minute + service.duration;
    if (end > closing) {
      setError("El servicio termina después del cierre. Elige una hora anterior.");
      return;
    }
    if (appointments.some((item) => item.date === draft.date && item.staff === draft.staff && draft.minute < item.minute + durationOf(item) && item.minute < end)) {
      setError("La franja se cruza con otra cita. Elige otro horario o profesional.");
      return;
    }
    setPending(true);
    timer.current = setTimeout(() => save({ ...draft, id: `demo-cita-${appointments.length + 1}` }), 400);
  }
  function change(fields: Partial<Appointment>) {
    setError("");
    const next = { ...draft, ...fields };
    setDraft(next);
    onPreview(next);
  }
  function cancel() {
    const dirty = draft !== initial && (draft.date !== initial.date || draft.minute !== initial.minute || draft.staff !== initial.staff || draft.service || draft.client);
    if (!dirty || window.confirm("¿Descartar los cambios de esta cita de prueba?")) close();
  }
  return <Panel close={cancel} title="Nueva cita" footer={<><button className="button" onClick={cancel}>Cancelar</button><button className="button primary" form="appointment-form" disabled={pending} type="submit">{pending ? "Añadiendo…" : "Añadir cita de prueba"}</button></>}>
    <p className="panel-note">Esta cita se conserva solo mientras la Agenda permanece abierta.</p>
    <form id="appointment-form" className="editor" onSubmit={submit} aria-busy={pending}>
      <fieldset disabled={pending}>
        <legend>Horario y servicio</legend>
        <div className="form-pair"><label>Fecha<input type="date" required value={draft.date} onChange={(event) => { if (validDate(event.target.value)) change({ date: event.target.value }); }}/></label>
        <label>Hora<select value={draft.minute} onChange={(event) => change({ minute: Number(event.target.value) })}>{slots.map((minute) => <option key={minute} value={minute}>{time(minute)}</option>)}</select></label></div>
        <label>Profesional<select value={draft.staff} onChange={(event) => change({ staff: event.target.value, service: "" })}>{staff.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
        <label>Servicio<select required value={draft.service} onChange={(event) => change({ service: event.target.value })}><option value="">Seleccionar servicio</option>{eligible.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.duration} min</option>)}</select></label>
        <label>Cliente (opcional)<select value={draft.client} onChange={(event) => change({ client: event.target.value })}><option value="">Sin cliente</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}</select></label>
      </fieldset>
      {error && <p className="error-box" role="alert">{error}</p>}
      {pending && <p role="status">Añadiendo cita de demostración…</p>}
    </form>
    {service && <div className="editor-total"><span>Total estimado</span><strong>{money(service.price)} MXN</strong></div>}
  </Panel>;
}
