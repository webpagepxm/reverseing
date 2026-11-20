"use client";

import Link from "next/link";
import { useQuery } from "../lib/query";
import { CalendarDays, ChevronDown, ChevronRight, CircleHelp, Clock3, FlaskConical, MapPin, Menu, Settings2, Shapes, UsersRound, UserRound } from "lucide-react";
import { useState } from "react";
import { modules, scope } from "../lib/navigation";
import { Agenda } from "./agenda";
import { Directory } from "./directory";
import { Avatar } from "./ui";

const icons = [CalendarDays, UserRound, Shapes, UsersRound, Settings2];

export function Workspace({ route }: { route: string }) {
  const group = modules.find((module) => module.sections.some((section) => section.href === route))!;
  const section = group.sections.find((item) => item.href === route)!;
  const [menu, setMenu] = useState<"modules" | "sections" | null>(null);
  const [demoInfo, setDemoInfo] = useState(false);
  const { params } = useQuery();
  const panel = Boolean(params.get("cita") || params.get("ficha"));
  return (
    <div className={`workspace ${panel ? "has-panel" : ""}`}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <aside className={`rail ${menu === "modules" ? "expanded" : ""}`}>
        <Link className="brand" href={scope + "/agenda"} aria-label="Mambo Jambo · Agenda" onClick={() => setMenu(null)}><span className="monogram" aria-hidden="true">m<span>.</span></span><span>Mambo<br/>Jambo</span></Link>
        <nav aria-label="Módulos">{modules.map((item, index) => {
          const Icon = icons[index];
          return <Link key={item.name} className="rail-link" href={scope + "/" + item.href} aria-current={item === group ? "true" : undefined} onClick={() => setMenu(null)}><Icon size={21} strokeWidth={1.8}/><span>{item.name}</span></Link>;
        })}</nav>
        <div className="rail-footer"><Avatar name="Equipo Demo" /><span>Estudio Mambo</span></div>
      </aside>
      <header className="workspace-bar">
        <button className="icon-button mobile-menu" aria-label="Módulos" aria-expanded={menu === "modules"} onClick={() => setMenu(menu === "modules" ? null : "modules")}><Menu size={21}/></button>
        <div className="workspace-location"><span className="location-mark"><MapPin size={17}/></span><span><strong>Estudio Mambo</strong><small>Roma Norte</small></span></div>
        <div className="demo-control">
          <button className="demo-badge" aria-expanded={demoInfo} onClick={() => setDemoInfo(!demoInfo)}><FlaskConical size={15}/> <span>Demostración</span></button>
          {demoInfo && <div className="demo-popover"><CircleHelp size={17}/><p>Datos ficticios. Las citas de prueba se conservan en memoria mientras la Agenda permanece abierta.</p></div>}
        </div>
      </header>
      <aside className={`section-nav ${menu === "sections" ? "expanded" : ""}`}>
        <p className="section-title">{group.name}</p>
        <nav aria-label={`Secciones de ${group.name}`}>{group.sections.map((item) => (
          <Link href={scope + "/" + item.href} key={item.href} aria-current={route === item.href ? "page" : undefined} onClick={() => setMenu(null)}>
            {item.href === "equipo/turnos" ? <Clock3 size={16}/> : <ChevronRight size={16}/>}<span>{item.name}</span>
          </Link>
        ))}</nav>
      </aside>
      <main id="contenido" className="content">
        <button className="section-toggle" aria-expanded={menu === "sections"} onClick={() => setMenu(menu === "sections" ? null : "sections")}>{group.name}<ChevronRight size={13}/>{section.name}<ChevronDown size={15}/></button>
        {route === "agenda" ? <Agenda /> : <Directory key={route} route={route} />}
      </main>
    </div>
  );
}
