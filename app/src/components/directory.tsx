"use client";

import Link from "next/link";
import { useState } from "react";
import { demoDate, formatDate, time } from "../lib/demo";
import { href } from "../lib/navigation";
import { useQuery } from "../lib/query";
import { byId, currency, saleTotal, upsert, uuid, type Role, type Shift } from "../lib/v2/model";
import { covers } from "../lib/v2/operations";
import { commit, reset, useDemo } from "../lib/v2/store";
import { Heading, Panel } from "./ui";
import { Action, Checks, Choice, clock, Details, Editor, Field, includes, numeric, Rows, Search, text } from "./v2/common";

const roles: Role[] = ["Recepción", "Responsable de sucursal", "Administrador"];
const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((name, id) => ({ id: String(id), name }));
const zones = ["America/Mexico_City", "America/Cancun", "America/Tijuana"].map((id) => ({ id, name: id }));

export function Directory({ route }: { route: string }) {
  const demo = useDemo();
  const { params, update } = useQuery();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("asc");
  const [tab, setTab] = useState("Resumen");
  const selected = params.get("ficha");
  const edit = selected === "nuevo" || params.get("editar") === "1";
  const close = () => update({ ficha: null, editar: null }, true);
  const open = (id: string) => { setTab("Resumen"); update({ ficha: id, editar: null }); };
  const editing = () => update({ editar: "1" });
  const newRecord = (label: string) => <button className="button primary" onClick={() => open("nuevo")}>{label}</button>;
  const match = (state: boolean) => !filter || (filter === "archivados" ? state : !state);
  const ordered = <T extends { name: string }>(records: T[]) => records.toSorted((a, b) => sort === "asc" ? a.name.localeCompare(b.name, "es") : b.name.localeCompare(a.name, "es"));

  if (route === "clientes") {
    const client = byId(demo.clients, selected ?? "");
    const appointments = demo.appointments.filter((item) => item.client === client?.id);
    const purchases = demo.sales.filter((item) => item.client === client?.id && ["Pagada", "Anulada"].includes(item.status));
    const rows = ordered(demo.clients.filter((item) => match(item.archived) && includes(item.name + " " + item.contact + " " + item.phone, query)));
    return <>
      <Heading title="Clientes" action={newRecord("Nuevo cliente")}/>
      <Search label="Buscar clientes" value={query} set={setQuery}><label>Estado<select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Todos</option><option value="activos">Activos</option><option value="archivados">Archivados</option></select></label><label>Orden<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="asc">Nombre A–Z</option><option value="desc">Nombre Z–A</option></select></label></Search>
      <Rows columns={["Nombre", "Correo electrónico", "Teléfono", "Estado"]} rows={rows.map((item) => ({ ...item, values: [item.contact || "—", item.phone || "—", item.archived ? "Archivado" : "Activo"], open: () => open(item.id) }))}/>
      {edit && <Editor title={client ? "Editar cliente" : "Nuevo cliente"} close={close} save={(data) => commit((current) => {
        const first = text(data, "name");
        const name = [first, text(data, "surname")].filter(Boolean).join(" ");
        const contact = text(data, "email");
        const phone = text(data, "phone");
        if (!first) throw Error("Escribe un nombre.");
        if (current.clients.some((item) => item.id !== client?.id && ((contact && item.contact.toLowerCase() === contact.toLowerCase()) || (phone && item.phone.replace(/\D/g, "") === phone.replace(/\D/g, ""))))) throw Error("Hay un cliente con ese correo o teléfono. Búscalo en el listado.");
        return { ...current, clients: upsert(current.clients, { id: client?.id ?? uuid(), name, contact, phone, notes: text(data, "notes"), tone: client?.tone ?? "sage", archived: client?.archived ?? false }) };
      })}>
        <Field name="name" label="Nombre" value={client?.name.split(" ")[0]} required/><Field name="surname" label="Apellidos" value={client?.name.split(" ").slice(1).join(" ")}/><Field name="phone" label="Teléfono" value={client?.phone} type="tel"/><Field name="email" label="Correo" value={client?.contact} type="email"/><Field name="notes" label="Notas" value={client?.notes}/>
      </Editor>}
      {client && !edit && <Panel close={close} title="Ficha de cliente">
        <div className="detail-hero"><h3>{client.name}</h3><p>{client.archived ? "Archivado" : "Activo"}</p></div>
        <div className="segmented detail-tabs" role="group" aria-label="Vista de ficha">{["Resumen", "Datos", "Citas", "Compras", "Historial"].map((item) => <button key={item} onClick={() => setTab(item)} aria-pressed={tab === item}>{item}</button>)}</div>
        {tab === "Resumen" && <Details fields={[["Citas", appointments.length], ["Compras", purchases.filter((item) => item.status === "Pagada").length], ["Notas", client.notes]]}/>}
        {tab === "Datos" && <Details fields={[["Correo electrónico", client.contact], ["Teléfono", client.phone], ["Notas", client.notes]]}/>}
        {(tab === "Citas" || tab === "Historial") && <ul className="history">{appointments.map((item) => <li key={item.id}><Link href={href("agenda", { cita: item.id, fecha: item.date, sucursal: item.branch })}>{item.label}</Link><small>{formatDate(item.date, { dateStyle: "medium" })} · {item.status}</small>{tab === "Historial" && item.history.map((entry, i) => <small key={i}>{entry}</small>)}</li>)}</ul>}
        {(tab === "Compras" || tab === "Historial") && <ul className="history">{purchases.map((item) => <li key={item.id}><Link href={href("ventas/nueva", { ficha: item.id, sucursal: item.branch })}>{item.folio} · {currency(saleTotal(item))}</Link><small>{item.date} · {item.status}</small></li>)}</ul>}
        {((tab === "Citas" && !appointments.length) || (tab === "Compras" && !purchases.length) || (tab === "Historial" && !appointments.length && !purchases.length)) && <p className="panel-note">Todavía no hay registros para este cliente.</p>}
        <div className="actions"><button className="button" onClick={editing}>Editar cliente</button><Action label={client.archived ? "Reactivar cliente" : "Archivar cliente"} confirmation="¿Cambiar el estado del cliente?" run={() => commit((current) => ({ ...current, clients: upsert(current.clients, { ...client, archived: !client.archived }) }))}/>{!client.archived && <Link className="button primary" href={href("agenda", { cita: "nueva", cliente: client.id })}>Nueva cita para cliente</Link>}</div>
      </Panel>}
      {selected && !client && !edit && <Panel title="Cliente no disponible" close={close}><p>El registro ya no está en la demostración.</p></Panel>}
    </>;
  }

  if (route.startsWith("catalogo/")) {
    const categories = [...new Set(demo.services.map((item) => item.category))].sort();
    const service = byId(demo.services, selected ?? "");
    if (route === "catalogo/categorias") return <><Heading title="Categorías"/><Rows columns={["Categoría", "Servicios"]} rows={categories.map((item) => ({ id: item, name: item, values: [<Link key={item} href={href("catalogo/servicios", { categoria: item })}>{demo.services.filter((entry) => entry.category === item).length} servicios</Link>] }))}/></>;
    const category = params.get("categoria") ?? "";
    const rows = ordered(demo.services.filter((item) => (!category || item.category === category) && match(item.archived) && includes(item.name, query)));
    return <>
      <Heading title="Servicios" action={newRecord("Nuevo servicio")}/>
      <Search label="Buscar servicios" value={query} set={setQuery}><label>Estado<select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Todos</option><option value="activos">Activos</option><option value="archivados">Archivados</option></select></label></Search>
      <div className="catalog-grid"><aside className="surface category-menu" aria-label="Categorías de servicios"><h2>Categorías</h2>{["Todos", ...categories].map((name) => <button key={name} aria-pressed={category === (name === "Todos" ? "" : name)} onClick={() => update({ categoria: name === "Todos" ? null : name })}>{name}</button>)}</aside>
        <Rows columns={["Servicio", "Categoría", "Duración", "Precio", "Estado", "Equipo"]} rows={rows.map((item) => ({ ...item, values: [item.category, item.duration + " min", currency(Math.round(item.price * 100)), item.archived ? "Archivado" : "Activo", item.staff.map((id) => byId(demo.staff, id)?.name).join(", ")], open: () => open(item.id) }))}/>
      </div>
      {edit && <Editor title={service ? "Editar servicio" : "Nuevo servicio"} close={close} save={(data) => commit((current) => {
        const name = text(data, "name");
        const grouping = text(data, "category");
        if (!name || !grouping) throw Error("Escribe nombre y categoría.");
        const duration = numeric(data, "duration");
        const price = numeric(data, "price");
        if (!Number.isInteger(duration) || duration < 1 || duration > 720 || price < 0 || !Number.isFinite(price)) throw Error("Revisa la duración y el precio.");
        const branches = data.getAll("branches").map(String);
        if (!branches.length) throw Error("Selecciona al menos una sucursal.");
        return { ...current, services: upsert(current.services, { id: service?.id ?? uuid(), name, category: grouping, description: text(data, "description"), duration, price, staff: data.getAll("staff").map(String), branches, archived: service?.archived ?? false }) };
      })}>
        <Field name="name" label="Nombre" value={service?.name} required/><Field name="category" label="Categoría" value={service?.category ?? (category || undefined)} required/><Field name="description" label="Descripción" value={service?.description}/><Field name="duration" label="Duración en minutos" type="number" min={1} max={720} value={service?.duration ?? 60} required/><Field name="price" label="Precio (MXN)" type="number" min={0} step={.01} value={service?.price ?? 0} required/>
        <Checks name="staff" label="Empleados habilitados" items={demo.staff.filter((item) => !item.archived)} selected={service?.staff ?? []}/><Checks name="branches" label="Sucursales" items={demo.branches} selected={service?.branches ?? [demo.branch]}/>
      </Editor>}
      {service && !edit && <Panel close={close} title="Detalle de servicio"><div className="detail-hero"><h3>{service.name}</h3><p>{service.category}</p></div><Details fields={[["Descripción", service.description], ["Duración", service.duration + " min"], ["Precio", currency(Math.round(service.price * 100))], ["Equipo asignado", service.staff.map((id) => byId(demo.staff, id)?.name).join(", ")], ["Estado", service.archived ? "Archivado" : "Activo"]]}/><div className="actions"><button className="button" onClick={editing}>Editar servicio</button><Action label={service.archived ? "Reactivar servicio" : "Archivar servicio"} confirmation="¿Cambiar disponibilidad del servicio?" run={() => commit((current) => ({ ...current, services: upsert(current.services, { ...service, archived: !service.archived }) }))}/></div></Panel>}
    </>;
  }

  if (route === "equipo/turnos") {
    const shift = byId(demo.shifts, selected ?? "");
    const rows = demo.shifts.filter((item) => item.branch === demo.branch && (!filter || item.member === filter));
    return <>
      <Heading title="Turnos" action={newRecord("Nuevo turno")}/>
      <div className="directory-toolbar"><label>Profesional<select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">Todo el equipo</option>{demo.staff.filter((item) => item.branches.includes(demo.branch)).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
      <Rows columns={["Profesional", "Horario semanal", "Días", "Vigente desde"]} rows={rows.map((item) => ({ id: item.id, name: byId(demo.staff, item.member)?.name ?? item.member, values: [time(item.start) + "–" + time(item.end), item.days.map((day) => days[day].name).join(", "), item.since], open: () => open(item.id) }))}/>
      {(shift || selected === "nuevo") && <Editor title={shift ? "Editar turno" : "Nuevo turno"} close={close} save={(data) => commit((current) => {
        const next: Shift = { id: shift?.id ?? uuid(), member: text(data, "staff"), branch: current.branch, days: data.getAll("days").map(Number), start: clock(text(data, "start")), end: clock(text(data, "end")), since: text(data, "since") };
        if (!next.days.length || !(next.start < next.end)) throw Error("Elige días de repetición y una hora de fin posterior al inicio.");
        if (current.shifts.some((item) => item.id !== next.id && item.member === next.member && item.branch === next.branch && item.since === next.since)) throw Error("El profesional ya tiene un turno desde esa fecha.");
        const updated = { ...current, shifts: upsert(current.shifts, next) };
        const affected = current.appointments.filter((event) => event.status === "Reservada" && event.branch === current.branch && (event.staff === next.member || event.staff === shift?.member) && covers(current, event) && !covers(updated, event));
        if (affected.length) throw Error("El cambio afecta citas existentes: " + affected.map((item) => item.date + " " + time(item.minute) + " · " + item.label).join(", ") + ".");
        return updated;
      })}>
        <Choice name="staff" label="Profesional" items={demo.staff.filter((item) => !item.archived && item.branches.includes(demo.branch))} value={shift?.member ?? filter}/>
        <Field name="since" label="Vigente desde" type="date" value={shift?.since ?? demoDate} required/>
        <Field name="start" label="Inicio" type="time" value={time(shift?.start ?? 540)} required/><Field name="end" label="Fin" type="time" value={time(shift?.end ?? 1080)} required/>
        <Checks name="days" label="Repetición semanal" items={days} selected={shift?.days.map(String) ?? ["1", "2", "3", "4", "5"]}/>
      </Editor>}
    </>;
  }

  if (route === "equipo" || route === "equipo/asignaciones") {
    const member = byId(demo.staff, selected ?? "");
    const assignment = route.endsWith("asignaciones");
    const rows = ordered(demo.staff.filter((item) => (!filter || item.branches.includes(filter)) && includes(item.name + " " + item.role, query)));
    return <>
      <Heading title={assignment ? "Asignaciones" : "Miembros"} action={!assignment && newRecord("Nuevo miembro")}/>
      <Search label="Buscar miembros" value={query} set={setQuery}><label>Sucursal<select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="">Todas</option>{demo.branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></Search>
      <Rows columns={["Nombre", "Especialidad", "Sucursales", "Estado"]} rows={rows.map((item) => ({ ...item, values: [item.role, item.branches.map((id) => byId(demo.branches, id)?.name).join(", "), item.archived ? "Archivado" : "Activo"], open: () => open(item.id) }))}/>
      {edit && <Editor title={member ? "Editar miembro" : "Nuevo miembro"} close={close} save={(data) => commit((current) => {
        const name = text(data, "name");
        const branches = data.getAll("branches").map(String);
        if (!name || !branches.length) throw Error("Escribe el nombre y selecciona una sucursal.");
        if (current.appointments.some((item) => item.staff === member?.id && item.status === "Reservada" && !branches.includes(item.branch))) throw Error("Hay citas reservadas en una sucursal que deseas retirar.");
        const id = member?.id ?? uuid();
        const assigned = data.getAll("services").map(String);
        return { ...current, staff: upsert(current.staff, { id, name, branches, role: text(data, "role"), tone: member?.tone ?? "sage", hours: "", archived: member?.archived ?? false }), services: current.services.map((item) => ({ ...item, staff: assigned.includes(item.id) ? [...new Set([...item.staff, id])] : item.staff.filter((staffId) => staffId !== id) })) };
      })}>
        <Field name="name" label="Nombre" value={member?.name} required/><Field name="role" label="Especialidad" value={member?.role}/><Checks name="branches" label="Sucursales" items={demo.branches} selected={member?.branches ?? [demo.branch]}/><Checks name="services" label="Servicios asignados" items={demo.services} selected={demo.services.filter((item) => member && item.staff.includes(member.id)).map((item) => item.id)}/>
      </Editor>}
      {member && !edit && <Panel close={close} title="Ficha de miembro"><div className="detail-hero"><h3>{member.name}</h3><p>{member.role}</p></div><Details fields={[["Servicios asignados", demo.services.filter((item) => item.staff.includes(member.id)).map((item) => item.name).join(", ")], ["Acceso", "Empleado operativo · rol de acceso independiente"], ["Estado", member.archived ? "Archivado" : "Activo"]]}/><div className="actions"><button className="button" onClick={editing}>Editar miembro</button><Action label={member.archived ? "Reactivar miembro" : "Archivar miembro"} confirmation="¿Cambiar el estado del miembro?" run={() => commit((current) => {
        if (!member.archived && current.appointments.some((item) => item.staff === member.id && item.status === "Reservada")) throw Error("Resuelve las citas reservadas antes de archivar.");
        return { ...current, staff: upsert(current.staff, { ...member, archived: !member.archived }) };
      })}/></div></Panel>}
    </>;
  }

  if (route === "configuracion/sucursales") {
    const branch = byId(demo.branches, selected ?? "");
    return <><Heading title="Sucursales" action={newRecord("Nueva sucursal")}/><Rows columns={["Sucursal", "Zona horaria", "Empleados asignados"]} rows={demo.branches.map((item) => ({ ...item, values: [item.zone, demo.staff.filter((member) => member.branches.includes(item.id)).map((member) => member.name).join(", ")], open: () => open(item.id) }))}/>
      {(branch || selected === "nuevo") && <Editor title={branch ? "Editar sucursal" : "Nueva sucursal"} close={close} save={(data) => commit((current) => {
        const name = text(data, "name");
        if (!name) throw Error("Escribe un nombre.");
        return { ...current, branches: upsert(current.branches, { id: branch?.id ?? uuid(), name, zone: text(data, "zone") }) };
      })}><Field name="name" label="Nombre" value={branch?.name} required/><Choice name="zone" label="Zona horaria" items={zones} value={branch?.zone ?? demo.business.zone}/></Editor>}</>;
  }

  if (route === "configuracion/accesos") return <><Heading title="Accesos"/><div className="surface v2-card"><h2>Perfiles de ejemplo</h2><p>El rol solo cambia la navegación de demostración dentro de este navegador.</p><div className="actions">{roles.map((role) => <Action key={role} label={role === demo.role ? role + " · activo" : role} run={() => commit((current) => ({ ...current, role }))}/>)}</div></div></>;

  const prefs = route === "configuracion/preferencias";
  return <><Heading title={prefs ? "Preferencias operativas" : "Negocio"} action={<button className="button primary" onClick={() => open("negocio")}>Editar</button>}/>
    <div className="surface settings-card"><h2>{demo.business.name}</h2><Details fields={[["País", demo.business.country], ["Moneda", "Peso mexicano (MXN)"], ["Zona horaria", demo.business.zone], ["Preferencias", demo.business.preferences]]}/></div>
    {prefs && <div className="surface v2-card"><h2>Datos de demostración</h2><p>Se eliminarán los cambios locales de este navegador y volverán los registros iniciales.</p><Action label="Restablecer demostración" confirmation="¿Eliminar los cambios locales y recuperar los registros de prueba?" run={() => { reset(); close(); }}/></div>}
    {selected === "negocio" && <Editor title="Editar negocio" close={close} save={(data) => commit((current) => ({ ...current, business: { ...current.business, name: text(data, "name") || current.business.name, country: text(data, "country"), zone: text(data, "zone"), preferences: text(data, "preferences") } }))}><Field name="name" label="Nombre" value={demo.business.name} required/><Field name="country" label="País" value={demo.business.country} required/><Choice name="zone" label="Zona horaria" items={zones} value={demo.business.zone}/><Field name="preferences" label="Preferencias" value={demo.business.preferences}/></Editor>}
  </>;
}
