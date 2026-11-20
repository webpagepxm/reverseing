export const demoDate = "2026-11-18";
export const timezone = "America/Mexico_City";
export const staff = [
  { id: "ines", name: "Inés Mora", role: "Estilista", tone: "sage", hours: "09:00–18:00" },
  { id: "mateo", name: "Mateo Cruz", role: "Barbero", tone: "sand", hours: "09:00–18:00" },
  { id: "luna", name: "Luna Reyes", role: "Estilista", tone: "lilac", hours: "09:00–18:00" },
];

export const clients = [
  { id: "alba", name: "Alba Torres", contact: "alba@example.test", tone: "sage" },
  { id: "sofia", name: "Sofía Luna", contact: "sofia@example.test", tone: "lilac" },
  { id: "daniel", name: "Daniel Ríos", contact: "daniel@example.test", tone: "sand" },
  { id: "camila", name: "Camila Vega", contact: "camila@example.test", tone: "lilac" },
  { id: "valeria", name: "Valeria Solís", contact: "valeria@example.test", tone: "sage" },
  { id: "nicolas", name: "Nicolás Ávila", contact: "nicolas@example.test", tone: "sand" },
  { id: "renata", name: "Renata Silva", contact: "renata@example.test", tone: "sage" },
];

export const services = [
  { id: "corte", name: "Corte y estilo", category: "Cabello", duration: 60, price: 480, staff: ["ines", "luna"] },
  { id: "barba", name: "Diseño de barba", category: "Barbería", duration: 45, price: 320, staff: ["mateo"] },
  { id: "color", name: "Matiz y brillo", category: "Color", duration: 90, price: 950, staff: ["ines", "luna"] },
  { id: "clasico", name: "Corte clásico", category: "Barbería", duration: 60, price: 420, staff: ["mateo"] },
  { id: "peinado", name: "Peinado", category: "Cabello", duration: 60, price: 550, staff: ["ines", "luna"] },
  { id: "tratamiento", name: "Tratamiento hidratante", category: "Cabello", duration: 60, price: 690, staff: ["ines", "luna"] },
];

export type Appointment = { id: string; date: string; minute: number; staff: string; service: string; client: string };

export const demoAppointments: Appointment[] = [
  { id: "a1", date: demoDate, minute: 570, staff: "ines", service: "corte", client: "alba" },
  { id: "a2", date: demoDate, minute: 675, staff: "ines", service: "color", client: "valeria" },
  { id: "a3", date: demoDate, minute: 555, staff: "mateo", service: "barba", client: "daniel" },
  { id: "a4", date: demoDate, minute: 645, staff: "mateo", service: "clasico", client: "nicolas" },
  { id: "a5", date: demoDate, minute: 600, staff: "luna", service: "tratamiento", client: "sofia" },
  { id: "a6", date: demoDate, minute: 735, staff: "luna", service: "peinado", client: "camila" },
  { id: "a7", date: demoDate, minute: 810, staff: "ines", service: "corte", client: "renata" },
  { id: "a8", date: "2026-11-17", minute: 600, staff: "ines", service: "color", client: "camila" },
  { id: "a9", date: "2026-11-20", minute: 660, staff: "ines", service: "peinado", client: "sofia" },
  { id: "a10", date: "2026-11-19", minute: 630, staff: "luna", service: "corte", client: "renata" },
];

export const initials = (name: string) => name.split(" ").map((part) => part[0]).slice(0, 2).join("");
export const money = (value: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(value);
export const time = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", { ...options, timeZone: "UTC" }).format(new Date(date + "T00:00:00Z"));
export const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: timezone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

export function moveDate(date: string, days: number) {
  const next = new Date(date + "T00:00:00Z");
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function monday(date: string) {
  return moveDate(date, -((new Date(date + "T00:00:00Z").getUTCDay() + 6) % 7));
}

export function validDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + "T00:00:00Z");
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}
