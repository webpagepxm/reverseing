"use client";

import { useId } from "react";

export function readMoney(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{0,9}(?:\.\d{1,2})?$/.test(normalized) || !normalized) return NaN;
  const [units, fraction = ""] = normalized.split(".");
  return Number(units) * 100 + Number(fraction.padEnd(2, "0"));
}

export function MoneyField({ label, value, change, error, hint }: {
  label: string; value: string; change: (value: string) => void; error?: string; hint?: string;
}) {
  const id = useId();
  return <div className="money-field">
    <label htmlFor={id}>{label}</label>
    <div className="money-input"><span aria-hidden="true">$</span><input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} onChange={(event) => change(event.target.value)} aria-invalid={!!error} aria-describedby={error || hint ? id + "-help" : undefined}/><span aria-hidden="true">MXN</span></div>
    {error ? <p id={id + "-help"} className="field-error" role="alert">{error}</p> : hint && <p id={id + "-help"} className="field-hint">{hint}</p>}
  </div>;
}
