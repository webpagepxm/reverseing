"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Empty, Panel, RecordList, SearchField } from "../ui";

export const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
export const numeric = (data: FormData, key: string) => Number(text(data, key));
export const clock = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));
export const includes = (label: string, query: string) => label.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().includes(query.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase());

export function Editor({ title, close, save, children, label = "Guardar" }: { title: string; close: () => void; save: (form: FormData) => void; children: ReactNode; label?: string }) {
  const [error, setError] = useState("");
  const saved = useRef(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saved.current) return;
    try { save(new FormData(event.currentTarget)); saved.current = true; close(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "No se pudo guardar."); }
  }
  return <Panel title={title} close={close} footer={<><button className="button" onClick={close}>Cancelar</button><button className="button primary" form="record-editor">{label}</button></>}>
    <form className="editor form-stack" id="record-editor" onSubmit={submit}>
      {children}
      {error && <p className="error-box" role="alert">{error}</p>}
    </form>
  </Panel>;
}

export function Field({ name, label, value, type = "text", required, min, max, step }: { name: string; label: string; value?: string | number; type?: string; required?: boolean; min?: string | number; max?: string | number; step?: number }) {
  return <label>{label}<input name={name} type={type} defaultValue={value} required={required} min={min} max={max} step={step}/></label>;
}

export function Choice({ name, label, items, value, blank }: { name: string; label: string; value?: string; items: { id: string; name: string }[]; blank?: string }) {
  return <label>{label}<select name={name} defaultValue={value} required={blank === undefined}>
    {blank !== undefined && <option value="">{blank}</option>}
    {items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
  </select></label>;
}

export function Checks({ name, label, items, selected }: { name: string; label: string; items: { id: string; name: string }[]; selected: string[] }) {
  return <fieldset className="checks"><legend>{label}</legend>{items.map((item) => <label key={item.id}><input type="checkbox" name={name} value={item.id} defaultChecked={selected.includes(item.id)}/>{item.name}</label>)}</fieldset>;
}

export function Action({ label, run, confirmation }: { label: string; run: () => void; confirmation?: string }) {
  const [error, setError] = useState("");
  return <div><button className="button" onClick={() => {
    if (confirmation && !window.confirm(confirmation)) return;
    try { run(); setError(""); } catch (failure) { setError(failure instanceof Error ? failure.message : "No se pudo completar."); }
  }}>{label}</button>{error && <p role="alert" className="error-box">{error}</p>}</div>;
}

export function Rows({ title, columns, rows }: Omit<Parameters<typeof RecordList>[0], "label"> & { title?: string }) {
  return rows.length ? <RecordList label={title ?? "Registros"} columns={columns} rows={rows}/>
    : <div className="surface"><Empty title="Sin registros" description="Los registros que coincidan con esta vista aparecerán aquí."/></div>;
}

export function Search({ value, set, label, children }: { value: string; set: (value: string) => void; label: string; children?: ReactNode }) {
  return <div className="directory-toolbar"><SearchField value={value} onChange={set} label={label}/>{children}</div>;
}

export function Metrics({ items }: { items: [string, ReactNode][] }) {
  return <div className="metrics">{items.map(([title, value]) => <div className="surface metric" key={title}><span>{title}</span><strong>{value}</strong></div>)}</div>;
}

export function Details({ fields }: { fields: [string, ReactNode][] }) {
  return <dl className="detail-list">{fields.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value ?? "—"}</dd></div>)}</dl>;
}
