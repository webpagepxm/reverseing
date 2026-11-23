import { clients, demoAppointments, demoDate, services, staff, timezone } from "../demo";

export type Status = "Reservada" | "Completada" | "Cancelada" | "Inasistencia";
export type DemoAppointment = typeof demoAppointments[number] & {
  branch: string; duration: number; price: number; label: string; status: Status; notes: string; history: string[];
};
export type Customer = typeof clients[number] & { phone: string; notes: string; archived: boolean };
export type Service = typeof services[number] & { description: string; branches: string[]; archived: boolean };
export type Member = typeof staff[number] & { branches: string[]; archived: boolean };
export type Shift = { id: string; member: string; branch: string; days: number[]; start: number; end: number; since: string };
export type Branch = { id: string; name: string; zone: string };
export type Supplier = { id: string; name: string; description: string; contact: string; phone: string; email: string; address: string; archived: boolean };
export type Product = { id: string; name: string; sku: string; category: string; description: string; price: number; supplier: string; branch: string; tracked: boolean; archived: boolean };
export type StockMovement = { id: string; product: string; delta: number; date: string; kind: string; source: string };
export type StockCount = { id: string; product: string; expected: number; counted: number; date: string; status: "Borrador" | "Conteo" | "Revisión" | "Aplicado" };
export type Order = { id: string; supplier: string; branch: string; date: string; lines: { product: string; quantity: number; received: number }[] };
export type SaleLine = { kind: "service" | "product"; item: string; name: string; quantity: number; unit: number };
export type Sale = { id: string; folio: string; date: string; branch: string; staff: string; client: string; appointment: string; lines: SaleLine[]; tip: number; status: "Borrador" | "Pendiente de pago" | "Pagada" | "Anulada" };
export type Payment = { id: string; sale: string; session: string; amount: number; received: number; change: number; date: string };
export type Session = { id: string; branch: string; openedAt: string; opening: number; openingReason?: string; closedAt?: string; counted?: number; expected?: number; kept?: number; withdrawn?: number; reason?: string };
export type CashMovement = { id: string; session: string; amount: number; kind: "Entrada" | "Salida" | "Venta" | "Ajuste"; reason: string; timestamp: string; sale?: string };
export type CommissionRule = { id: string; staff: string; category: "Servicios" | "Productos"; rate: number; from: string; until: string };
export type Earning = { id: string; sale: string; staff: string; branch: string; date: string; base: number; commission: number; tip: number; adjustment: boolean; rule?: string };
export type Payout = { id: string; staff: string; from: string; until: string; entries: string[]; status: "Borrador" | "Revisada" | "Aprobada" | "Pago registrado"; reference: string; history: string[] };
export type Segment = { id: string; name: string; type: "Estándar" | "Personalizado"; metric: "Citas" | "Compras" | "Servicio"; op: "al menos" | "como máximo"; threshold: number; days: number; service: string };
export type Role = "Recepción" | "Responsable de sucursal" | "Administrador";
export type Demo = {
  version: 2;
  branch: string;
  role: Role;
  business: { name: string; country: string; currency: string; zone: string; preferences: string };
  branches: Branch[];
  clients: Customer[];
  services: Service[];
  staff: Member[];
  shifts: Shift[];
  appointments: DemoAppointment[];
  suppliers: Supplier[];
  products: Product[];
  stock: StockMovement[];
  counts: StockCount[];
  orders: Order[];
  sales: Sale[];
  payments: Payment[];
  sessions: Session[];
  cash: CashMovement[];
  rules: CommissionRule[];
  earnings: Earning[];
  payouts: Payout[];
  segments: Segment[];
};
export const defaultBranch = "roma-norte";
export const fixtureService = "corte-fixture";
export const uuid = () => crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint32Array(4))).map((part) => part.toString(36)).join("-");
export const todayAt = (zone: string) => new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
export const currency = (cents: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(cents / 100);
export const cents = (value: FormDataEntryValue | null) => Math.round(Number(value) * 100);
export const stockFor = (demo: Demo, product: string) => demo.stock.filter((move) => move.product === product).reduce((total, move) => total + move.delta, 0);
export const cashFor = (demo: Demo, session: Session) => session.expected ?? session.opening + demo.cash.filter((move) => move.session === session.id).reduce((total, move) => total + move.amount, 0);
export const openSession = (demo: Demo, branch = demo.branch) => demo.sessions.find((session) => session.branch === branch && !session.closedAt);
export const saleTotal = (sale: Sale) => sale.lines.reduce((total, line) => total + line.quantity * line.unit, 0) + sale.tip;
export const byId = <T extends { id: string }>(items: T[], id: string) => items.find((item) => item.id === id);
export const upsert = <T extends { id: string }>(items: T[], item: T) => items.some((entry) => entry.id === item.id) ? items.map((entry) => entry.id === item.id ? item : entry) : [...items, item];

export function createDemo(): Demo {
  return {
    version: 2, branch: defaultBranch, role: "Administrador",
    business: { name: "Estudio Mambo", country: "México", currency: "MXN", zone: timezone, preferences: "La venta en efectivo requiere una caja abierta." },
    branches: [{ id: defaultBranch, name: "Roma Norte", zone: timezone }, { id: "condesa", name: "Condesa", zone: timezone }],
    clients: clients.map((item) => ({ ...item, phone: "", notes: "", archived: false })),
    staff: staff.map((item) => ({ ...item, branches: [defaultBranch, ...(item.id === "luna" ? ["condesa"] : [])], archived: false })),
    services: [
      ...services.map((item) => ({ ...item, description: "", branches: [defaultBranch, "condesa"], archived: false })),
      { id: fixtureService, name: "Corte de prueba · 25 MXN", category: "Cabello", duration: 90, price: 25, staff: ["ines", "luna"], branches: [defaultBranch, "condesa"], description: "Caso de demostración de efectivo y propina.", archived: false },
    ],
    shifts: staff.flatMap((item) => (item.id === "luna" ? [defaultBranch, "condesa"] : [defaultBranch]).map((branch) => ({ id: "turno-" + item.id + "-" + branch, member: item.id, branch, days: [0, 1, 2, 3, 4, 5, 6], start: 540, end: 1080, since: "2026-01-01" }))),
    appointments: demoAppointments.map((item) => {
      const service = byId(services, item.service)!;
      return { ...item, branch: defaultBranch, duration: service.duration, price: service.price, label: service.name, status: "Reservada", notes: "", history: ["Cita de muestra"] };
    }),
    suppliers: [{ id: "proveedor-demo", name: "Botánica Insumos", description: "Proveedor ficticio de cuidado capilar", contact: "Equipo comercial", phone: "", email: "proveedor@example.test", address: "", archived: false }],
    products: [{ id: "producto-condesa", name: "Cera mineral", sku: "MJ-124", category: "Barbería", description: "Producto de prueba de Condesa.", price: 9800, supplier: "proveedor-demo", branch: "condesa", tracked: true, archived: false }, { id: "producto-demo", name: "Bruma botánica", sku: "MJ-123", category: "Cabello", description: "Producto de prueba con 12 unidades iniciales.", price: 12300, supplier: "proveedor-demo", branch: defaultBranch, tracked: true, archived: false }],
    stock: [
      { id: "stock-inicial", product: "producto-demo", delta: 12, date: demoDate, kind: "Saldo inicial", source: "producto-demo" },
      { id: "stock-condesa", product: "producto-condesa", delta: 5, date: demoDate, kind: "Saldo inicial", source: "producto-condesa" },
      { id: "recepcion-condesa", product: "producto-condesa", delta: 2, date: demoDate, kind: "Recepción", source: "pedido-muestra" },
      { id: "ajuste-condesa", product: "producto-condesa", delta: -1, date: demoDate, kind: "Recuento", source: "recuento-muestra" },
    ],
    counts: [{ id: "recuento-muestra", product: "producto-condesa", expected: 7, counted: 6, date: demoDate, status: "Aplicado" }],
    orders: [{ id: "pedido-muestra", supplier: "proveedor-demo", branch: "condesa", date: demoDate, lines: [{ product: "producto-condesa", quantity: 4, received: 2 }] }],
    sales: [{ id: "venta-muestra", folio: "MJ-0001", date: demoDate, branch: "condesa", staff: "luna", client: "", appointment: "", lines: [{ kind: "service", item: fixtureService, name: "Corte de prueba · 25 MXN", quantity: 1, unit: 2500 }], tip: 625, status: "Pagada" }],
    payments: [{ id: "pago-muestra", sale: "venta-muestra", session: "sesion-muestra", amount: 3125, received: 4000, change: 875, date: demoDate }],
    sessions: [{ id: "sesion-muestra", branch: "condesa", openedAt: demoDate + "T15:00:00.000Z", opening: 200000, closedAt: demoDate + "T23:00:00.000Z", counted: 203125, expected: 203125, kept: 200000, withdrawn: 3125, reason: "" }],
    cash: [{ id: "caja-muestra", session: "sesion-muestra", amount: 3125, kind: "Venta", reason: "MJ-0001", timestamp: demoDate + "T17:00:00.000Z", sale: "venta-muestra" }],
    rules: [{ id: "regla-demo", staff: "ines", category: "Servicios", rate: 20, from: "2026-01-01", until: "" }],
    earnings: [{ id: "propina-muestra", date: demoDate, sale: "venta-muestra", staff: "luna", branch: "condesa", base: 0, commission: 0, tip: 625, adjustment: false }],
    payouts: [{ id: "liquidacion-muestra", staff: "luna", from: demoDate, until: demoDate, entries: ["propina-muestra"], status: "Pago registrado", reference: "MUESTRA-001", history: ["Borrador", "Revisada", "Aprobada", "Pago registrado · ejemplo inicial"] }],
    segments: [{ id: "segmento-demo", name: "Clientes sin citas recientes", type: "Estándar", metric: "Citas", op: "como máximo", threshold: 0, days: 30, service: "" }],
  };
}
