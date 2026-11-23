"use client";

import { CalendarDays, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { initials } from "../lib/demo";

export function Avatar({ name, tone = "sage" }: { name: string; tone?: string }) {
  return <span aria-hidden="true" className={`avatar ${tone}`}>{initials(name)}</span>;
}

export function Heading({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="page-heading"><h1>{title}</h1>{action}</div>;
}

export function Empty({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty"><span className="empty-icon"><CalendarDays size={23} /></span><h2>{title}</h2><p>{description}</p>{action}</div>;
}

export function SearchField({ value, onChange, label }: { value: string; onChange: (value: string) => void; label: string }) {
  return <label className="search"><Search size={17} aria-hidden="true" /><input type="search" value={value} aria-label={label} placeholder={label} onChange={(event) => onChange(event.target.value)} /></label>;
}

export function Panel({ close, title, children, footer, sheet = false }: { close: () => void; title: string; children: ReactNode; footer?: ReactNode; sheet?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    const viewport = window.visualViewport;
    const resize = () => dialog?.style.setProperty("--visual-height", `${Math.floor(viewport?.height ?? window.innerHeight)}px`);
    viewport?.addEventListener("resize", resize);
    resize();
    dialog?.showModal();
    return () => {
      viewport?.removeEventListener("resize", resize);
      dialog?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={ref} className={`panel ${sheet ? "panel-sheet" : ""}`} aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); close(); }}>
      <div className="panel-header"><h2 id={titleId}>{title}</h2><button className="icon-button" aria-label="Cerrar panel" onClick={close}><X size={20} /></button></div>
      <div className="panel-body">{children}</div>
      {footer && <div className="panel-footer">{footer}</div>}
    </dialog>
  );
}

export function RecordList({ label, columns, rows }: { label: string; columns: string[]; rows: { id: string; name: string; tone?: string; values: ReactNode[]; open?: () => void }[] }) {
  return <div className="surface records"><table role="table" aria-label={label}><thead role="rowgroup"><tr role="row">{columns.map((column) => <th role="columnheader" scope="col" key={column}>{column}</th>)}</tr></thead>
    <tbody role="rowgroup">{rows.map((row) => <tr role="row" key={row.id}>
      <th role="rowheader" scope="row">{row.open ? <button className="record-button" onClick={row.open}>{row.tone && <Avatar name={row.name} tone={row.tone} />}{row.name}<ChevronRight size={16} className="record-arrow" /></button> : row.name}</th>
      {row.values.map((value, index) => <td role="cell" key={index}><span className="record-label" aria-hidden="true">{columns[index + 1]}</span><span>{value}</span></td>)}
    </tr>)}</tbody></table></div>;
}
