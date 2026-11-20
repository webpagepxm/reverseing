"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { createDemo, type Demo } from "./model";

const key = "mambo-jambo.demo.v2";
const seed = createDemo();
let snapshot = seed;
let loaded = false;
const listeners = new Set<() => void>();

function decode(raw: string | null) {
  if (!raw) return createDemo();
  const value: Demo = JSON.parse(raw);
  return value.version === 2 && Array.isArray(value.appointments) && Array.isArray(value.payments) ? value : createDemo();
}

function refresh() {
  try { snapshot = decode(localStorage.getItem(key)); }
  catch { snapshot = createDemo(); }
  loaded = true;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!loaded) refresh();
  function onStorage(event: StorageEvent) {
    if (event.key === key || event.key === null) {
      refresh();
      listener();
    }
  }
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function commit(change: (current: Demo) => Demo) {
  if (!loaded) refresh();
  const next = change(snapshot);
  if (next === snapshot) return;
  try { localStorage.setItem(key, JSON.stringify(next)); }
  catch { throw new Error("No se pudieron guardar los datos locales. Revisa el almacenamiento de tu navegador."); }
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function reset() {
  commit(createDemo);
}

const DemoContext = createContext(seed);
export const useDemo = () => useContext(DemoContext);

export function DemoProvider({ children }: { children: ReactNode }) {
  const demo = useSyncExternalStore(subscribe, () => snapshot, () => seed);
  return <DemoContext.Provider value={demo}>{children}</DemoContext.Provider>;
}
