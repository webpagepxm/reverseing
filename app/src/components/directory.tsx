"use client";

import { Building2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { clients, demoAppointments, demoDate, formatDate, money, services, staff, time, timezone } from "../lib/demo";
import { useQuery } from "../lib/query";
import { Avatar, Empty, Heading, Panel, RecordList, SearchField } from "./ui";

const categories = ["Todos", "Cabello", "Barbería", "Color"];
const normalize = (value: string) => value.toLocaleLowerCase("es-MX").normalize("NFD").replace(/\p{Diacritic}/gu, "");
const contains = (value: string, query: string) => normalize(value).includes(normalize(query.trim()));

export function Directory({ route }: { route: string }) {
  const { params, update } = useQuery();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [tab, setTab] = useState("Datos");
  const [shiftMember, setShiftMember] = useState("");
  const isClients = route === "clientes";
  const isServices = route === "catalogo/servicios";
  const isTeam = route === "equipo";
  const title = isClients ? "Clientes" : isServices ? "Servicios" : isTeam ? "Miembros" : route === "equipo/turnos" ? "Turnos" : route.endsWith("negocio") ? "Negocio" : route.endsWith("sucursales") ? "Sucursales" : "Accesos";
  const label = isClients ? "Buscar clientes" : isServices ? "Buscar servicios" : "Buscar miembros";
  const selected = params.get("ficha");
  const client = isClients ? clients.find((item) => item.id === selected) : undefined;
  const service = isServices ? services.find((item) => item.id === selected) : undefined;
  const person = isTeam ? staff.find((item) => item.id === selected) : undefined;
  const close = () => update({ ficha: null }, true);
  const open = (id: string) => { setTab("Datos"); update({ ficha: id }); };
  const visibleClients = clients.filter((item) => contains(item.name + " " + item.contact, query));
  const visibleServices = services.filter((item) => (category === "Todos" || item.category === category) && contains(item.name, query));
  const visibleStaff = staff.filter((item) => contains(item.name + " " + item.role, query));
  const rows = isClients ? visibleClients.map((item) => ({ ...item, values: [item.contact, <span className="status-chip" key="state">Activa</span>], open: () => open(item.id) }))
    : isServices ? visibleServices.map((item) => ({ ...item, values: [item.category, item.duration + " min", money(item.price) + " MXN"], open: () => open(item.id) }))
    : visibleStaff.map((item) => ({ ...item, values: [item.role, "Roma Norte"], open: () => open(item.id) }));
  return <>
    <Heading title={title}/>
    {(isClients || isServices || isTeam) && <section aria-label={title}>
      <div className="directory-toolbar"><SearchField label={label} value={query} onChange={setQuery}/><span className="directory-count" role="status">{rows.length} {rows.length === 1 ? "resultado" : "resultados"}</span></div>
      <div className={isServices ? "catalog-grid" : undefined}>
        {isServices && <aside className="surface category-menu" aria-label="Categorías de servicios"><h2>Categorías</h2>{categories.map((item) => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</aside>}
        {rows.length ? <RecordList label={title} rows={rows} columns={isClients ? ["Nombre", "Correo electrónico", "Estado"] : isServices ? ["Servicio", "Categoría", "Duración", "Precio"] : ["Nombre", "Especialidad", "Sucursal"]}/>
          : <div className="surface"><Empty title="No hay coincidencias" description="Prueba con otro nombre o restablece los filtros." action={<button className="button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Restablecer filtros</button>}/></div>}
      </div>
    </section>}
    {route === "equipo/turnos" && <section>
      <div className="directory-toolbar"><label className="select-control"><Clock3 size={16}/><select aria-label="Empleado de turnos" value={shiftMember} onChange={(event) => setShiftMember(event.target.value)}><option value="">Todo el equipo</option>{staff.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label></div>
      <RecordList label="Turnos de muestra" columns={["Profesional", "Horario", "Vigencia"]} rows={staff.filter((item) => !shiftMember || item.id === shiftMember).map((item) => ({ ...item, values: [item.hours, "Lunes a domingo"] }))}/>
    </section>}
    {route === "configuracion/negocio" && <section className="surface settings-card"><span className="location-mark"><Building2 size={19}/></span><h2>Estudio Mambo</h2><dl className="detail-list"><div><dt>País</dt><dd>México</dd></div><div><dt>Moneda</dt><dd>Peso mexicano (MXN)</dd></div></dl></section>}
    {route === "configuracion/sucursales" && <section className="surface settings-card"><span className="location-mark"><MapPin size={19}/></span><h2>Roma Norte</h2><dl className="detail-list"><div><dt>Negocio</dt><dd>Estudio Mambo</dd></div><div><dt>Zona horaria</dt><dd>{timezone}</dd></div></dl></section>}
    {route === "configuracion/accesos" && <section className="surface settings-card"><span className="location-mark"><ShieldCheck size={19}/></span><h2>Perfiles de ejemplo</h2><p>Los perfiles muestran cómo se organizarían los permisos al conectar la autenticación.</p><dl className="detail-list"><div><dt>Recepción</dt><dd>Agenda y clientes</dd></div><div><dt>Responsable de sede</dt><dd>Operación de sucursal</dd></div><div><dt>Administración</dt><dd>Negocio y accesos</dd></div></dl></section>}
    {client && <Panel close={close} title="Ficha de cliente"><div className="detail-hero"><Avatar name={client.name} tone={client.tone}/><h3>{client.name}</h3></div>
      <div className="segmented detail-tabs" role="group" aria-label="Vista de ficha">{["Datos", "Citas"].map((item) => <button key={item} onClick={() => setTab(item)} aria-pressed={tab === item}>{item}</button>)}</div>
      {tab === "Datos" ? <dl className="detail-list"><div><dt>Correo electrónico</dt><dd>{client.contact}</dd></div><div><dt>Estado</dt><dd>Activa</dd></div></dl>
        : <ul className="history">{demoAppointments.filter((item) => item.client === client.id).map((item) => <li key={item.id}><strong>{services.find((entry) => entry.id === item.service)?.name}</strong><small>{formatDate(item.date, { day: "numeric", month: "long" })} · {time(item.minute)}</small></li>)}</ul>}
    </Panel>}
    {service && <Panel close={close} title="Detalle de servicio"><div className="detail-hero"><h3>{service.name}</h3><p>{service.category}</p></div><dl className="detail-list"><div><dt>Duración</dt><dd>{service.duration} min</dd></div><div><dt>Precio</dt><dd>{money(service.price)} MXN</dd></div><div><dt>Equipo asignado</dt><dd>{staff.filter((item) => service.staff.includes(item.id)).map((item) => item.name).join(", ")}</dd></div></dl></Panel>}
    {person && <Panel close={close} title="Ficha de miembro"><div className="detail-hero"><Avatar name={person.name} tone={person.tone}/><h3>{person.name}</h3><p>{person.role}</p></div><dl className="detail-list"><div><dt>Sucursal</dt><dd>Roma Norte</dd></div><div><dt>Turno de muestra</dt><dd>{person.hours}</dd></div><div><dt>Servicios asignados</dt><dd>{services.filter((item) => item.staff.includes(person.id)).map((item) => item.name).join(", ")}</dd></div></dl><p className="panel-note">Datos de muestra desde el {formatDate(demoDate, { day: "numeric", month: "long" })}.</p></Panel>}
    {selected && !client && !service && !person && <Panel close={close} title="Ficha no disponible"><Empty title="No se encontró el registro" description="Vuelve a la lista para elegir un registro de muestra."/></Panel>}
  </>;
}
