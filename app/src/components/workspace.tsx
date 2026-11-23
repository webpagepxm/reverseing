"use client";

import Link from "next/link";
import { useQuery } from "../lib/query";
import { CalendarDays, ChevronDown, ChevronRight, CircleHelp, Clock3, FlaskConical, MapPin, Menu, Settings2, Shapes, UsersRound, UserRound, House, Receipt, ChartNoAxesCombined } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { href, modules, scope } from "../lib/navigation";
import { Agenda } from "./agenda";
import { Directory } from "./directory";
import { Sales } from "./v2/sales";
import { Cash } from "./v2/cash";
import { Inventory } from "./v2/inventory";
import { Compensation } from "./v2/compensation";
import { Insights } from "./v2/insights";
import { commit, DemoProvider, useDemo } from "../lib/v2/store";
import { Avatar } from "./ui";

const icons = [House, CalendarDays, Receipt, UserRound, Shapes, UsersRound, ChartNoAxesCombined, Settings2];

export function Workspace({ route }: { route: string }) {
  return <DemoProvider><Shell route={route}/></DemoProvider>;
}

function Shell({ route }: { route: string }) {
  const demo = useDemo();
  const allow = (name: string) => demo.role === "Administrador" || (demo.role === "Responsable de sucursal" ? name !== "Configuración" : ["Inicio", "Agenda", "Clientes"].includes(name));
  const [storageError, setStorageError] = useState("");
  const group = modules.find((module) => module.sections.some((section) => section.href === route))!;
  const section = group.sections.find((item) => item.href === route)!;
  const [menu, setMenu] = useState<"modules" | "sections" | null>(null);
  const [demoInfo, setDemoInfo] = useState(false);
  const { params, update } = useQuery();
  const branchInLink = params.get("sucursal");
  const linkedBranch = demo.branches.find((item) => item.id === branchInLink)?.id;
  useEffect(() => {
    if (!linkedBranch || demo.branch === linkedBranch) return;
    try { commit((current) => ({ ...current, branch: linkedBranch })); }
    catch (error) { setStorageError((error as Error).message); }
  }, [linkedBranch, demo.branch]);
  const panel = Boolean(params.get("cita") || (params.get("ficha") && route !== "ventas/nueva"));
  const groups: Record<string, string> = { "ventas": "Operaciones", "ventas/pagos": "Seguimiento", "ventas/caja": "Registro", "catalogo/servicios": "Catálogo", "catalogo/inventario": "Inventario", "equipo/comisiones": "Remuneración", "informes/citas": "Por operación" };
  return (
    <div className={`workspace ${panel ? "has-panel" : ""}`}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <aside className={`rail ${menu === "modules" ? "expanded" : ""}`}>
        <Link className="brand" href={scope + "/agenda"} aria-label="Mambo Jambo · Agenda" onClick={() => setMenu(null)}><span className="monogram" aria-hidden="true">m<span>.</span></span><span className="brand-name">Mambo<br/>Jambo</span></Link>
        <nav aria-label="Módulos">{modules.map((item, index) => {
          if (!allow(item.name) && item.name !== "Configuración") return null;
          const Icon = icons[index];
          return <Link key={item.name} className="rail-link" href={scope + "/" + item.href} aria-current={item === group ? "true" : undefined} onClick={() => setMenu(null)}><Icon size={21} strokeWidth={1.8}/><span>{item.name}</span></Link>;
        })}</nav>
        <div className="rail-footer"><Avatar name="Equipo Demo" /><span>{demo.business.name}</span></div>
      </aside>
      <header className="workspace-bar">
        <button className="icon-button mobile-menu" aria-label="Módulos" aria-expanded={menu === "modules"} onClick={() => setMenu(menu === "modules" ? null : "modules")}><Menu size={21}/></button>
        <div className="workspace-location"><span className="location-mark"><MapPin size={17}/></span><span><strong>{demo.business.name}</strong><select className="branch-select" aria-label="Sucursal activa" value={demo.branch} onChange={(event) => {
          const branch = event.target.value;
          try {
            update({ ficha: null, cita: null, citaOrigen: null, editar: null, cliente: null, persona: null, franja: null, empleado: null, sucursal: null }, true);
            commit((current) => ({ ...current, branch }));
            setStorageError("");
          } catch (error) { setStorageError((error as Error).message); }
        }}>{demo.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></span></div>
        <div className="demo-control">
          <button className="demo-badge" aria-expanded={demoInfo} onClick={() => setDemoInfo(!demoInfo)}><FlaskConical size={15}/> <span>Demostración</span></button>
          {demoInfo && <div className="demo-popover"><CircleHelp size={17}/><p>Datos ficticios guardados únicamente en este navegador. Rol de vista: {demo.role}.</p></div>}
        </div>
      </header>
      <aside className={`section-nav ${menu === "sections" ? "expanded" : ""}`}>
        <p className="section-title">{group.name}</p>
        <nav aria-label={`Secciones de ${group.name}`}>{group.sections.map((item) => (
          <Fragment key={item.href}>
          {groups[item.href] && <p className="section-group">{groups[item.href]}</p>}
          <Link href={scope + "/" + item.href} key={item.href} aria-current={route === item.href ? "page" : undefined} onClick={() => setMenu(null)}>
            {item.href === "equipo/turnos" ? <Clock3 size={16}/> : <ChevronRight size={16}/>}<span>{item.name}</span>
          </Link>
          </Fragment>
        ))}</nav>
      </aside>
      <main id="contenido" className="content">
        <button className="section-toggle" aria-expanded={menu === "sections"} onClick={() => setMenu(menu === "sections" ? null : "sections")}>{group.name}<ChevronRight size={13}/>{section.name}<ChevronDown size={15}/></button>
        {storageError && <p role="alert" className="error-box">{storageError}</p>}
        {allow(group.name) || group.name === "Configuración" ? <Screen key={route + demo.branch} route={route}/> :
          <div className="surface settings-card"><h1>Vista restringida</h1><p>Este módulo está oculto para el rol de demostración seleccionado.</p><Link className="button" href={href("configuracion/accesos")}>Cambiar rol de vista</Link></div>}
      </main>
    </div>
  );
}


function Screen({ route }: { route: string }) {
  if (route === "agenda") return <Agenda/>;
  if (route === "ventas/caja") return <Cash/>;
  if (route.startsWith("ventas")) return <Sales route={route}/>;
  if (route.startsWith("catalogo/") && !["catalogo/servicios", "catalogo/categorias"].includes(route)) return <Inventory route={route}/>;
  if (route === "equipo/comisiones" || route === "equipo/liquidaciones") return <Compensation route={route}/>;
  if (route === "inicio" || route.startsWith("informes") || route === "clientes/segmentos") return <Insights route={route}/>;
  return <Directory route={route}/>;
}
