import { validDate } from "../demo";
import { byId, cashFor, openSession, saleTotal, stockFor, todayAt, upsert, uuid, type Demo, type DemoAppointment, type Earning, type Sale } from "./model";

export function covers(demo: Demo, event: DemoAppointment) {
  const weekday = new Date(event.date + "T00:00:00Z").getUTCDay();
  const shift = demo.shifts.filter((item) => item.member === event.staff && item.branch === event.branch && item.since <= event.date).sort((a, b) => b.since.localeCompare(a.since))[0];
  return !!shift && shift.days.includes(weekday) && event.minute >= shift.start && event.minute + event.duration <= shift.end;
}

export function schedule(demo: Demo, event: DemoAppointment) {
  const old = byId(demo.appointments, event.id);
  const service = byId(demo.services, event.service);
  const member = byId(demo.staff, event.staff);
  if (!validDate(event.date) || !Number.isInteger(event.minute) || event.minute < 0 || event.minute + event.duration > 1440) throw Error("La fecha o el horario no son válidos.");
  if (!service || (!old && service.archived) || (service.archived && old?.service !== service.id) || !member || member.archived || !member.branches.includes(event.branch) || !service.staff.includes(event.staff) || !service.branches.includes(event.branch)) throw Error("El servicio no está habilitado para ese profesional y sucursal.");
  if (!covers(demo, event)) throw Error("El horario queda fuera del turno del profesional.");
  if (demo.appointments.some((item) => item.status === "Reservada" && item.id !== event.id && item.staff === event.staff && item.date === event.date && item.minute < event.minute + event.duration && event.minute < item.minute + item.duration)) throw Error("La franja se cruza con otra cita. Elige otro horario.");
  return { ...demo, appointments: upsert(demo.appointments, event) };
}

export function checkout(demo: Demo, id: string, received: number): Demo {
  const sale = byId(demo.sales, id);
  if (!sale) throw Error("La venta ya no está disponible.");
  if (sale.status === "Pagada") return demo;
  if (sale.status === "Anulada" || !sale.lines.length) throw Error("Añade al menos un artículo a una venta vigente.");
  const session = openSession(demo, sale.branch);
  if (!session) throw Error("Abre una sesión de caja en esta sucursal para cobrar.");
  const amount = saleTotal(sale);
  if (!Number.isSafeInteger(received) || received < amount) throw Error("El importe recibido debe cubrir el total.");
  const quantities = new Map<string, number>();
  for (const line of sale.lines) {
    if (line.kind !== "product") continue;
    const product = byId(demo.products, line.item);
    if (!product || product.archived || product.branch !== sale.branch) throw Error("Uno de los productos no está disponible en la sucursal.");
    if (product.tracked) quantities.set(product.id, (quantities.get(product.id) ?? 0) + line.quantity);
  }
  for (const [product, quantity] of quantities) if (stockFor(demo, product) < quantity) throw Error("Existencias insuficientes para completar la venta.");
  const date = todayAt(byId(demo.branches, sale.branch)?.zone ?? demo.business.zone);
  const timestamp = new Date().toISOString();
  const stock = [...demo.stock, ...Array.from(quantities, ([product, quantity]) => ({ id: id + "-salida-" + product, product, delta: -quantity, date, kind: "Venta", source: id }))];
  const earnings: Earning[] = [];
  if (sale.staff) {
    for (const category of ["Servicios", "Productos"] as const) {
      const rule = demo.rules.filter((item) => item.staff === sale.staff && item.category === category && item.from <= date && (!item.until || item.until >= date)).sort((a, b) => b.from.localeCompare(a.from))[0];
      const base = sale.lines.filter((line) => line.kind === (category === "Servicios" ? "service" : "product")).reduce((sum, line) => sum + line.quantity * line.unit, 0);
      if (rule && base) earnings.push({ id: id + "-" + category, sale: id, staff: sale.staff, branch: sale.branch, date, base, commission: Math.round(base * rule.rate / 100), tip: 0, adjustment: false, rule: rule.id });
    }
    if (sale.tip) earnings.push({ id: id + "-propina", sale: id, staff: sale.staff, branch: sale.branch, date, base: 0, commission: 0, tip: sale.tip, adjustment: false });
  }
  return {
    ...demo, stock, sales: upsert(demo.sales, { ...sale, status: "Pagada", date }),
    payments: [...demo.payments, { id: id + "-pago", sale: id, session: session.id, amount, received, change: received - amount, date }],
    cash: [...demo.cash, { id: id + "-caja", session: session.id, amount, kind: "Venta", reason: sale.folio, timestamp, sale: id }],
    earnings: [...demo.earnings, ...earnings],
  };
}

export function voidSale(demo: Demo, sale: Sale): Demo {
  const current = byId(demo.sales, sale.id);
  if (!current || current.status === "Anulada") return demo;
  if (current.status !== "Pagada") return { ...demo, sales: upsert(demo.sales, { ...current, status: "Anulada" }) };
  const session = openSession(demo, current.branch);
  const payment = demo.payments.find((item) => item.sale === current.id);
  if (!session || !payment || cashFor(demo, session) < payment.amount) throw Error("Abre una sesión con efectivo suficiente para registrar el ajuste.");
  const date = todayAt(byId(demo.branches, current.branch)?.zone ?? demo.business.zone);
  return {
    ...demo, sales: upsert(demo.sales, { ...current, status: "Anulada" }),
    cash: [...demo.cash, { id: current.id + "-ajuste", session: session.id, amount: -payment.amount, kind: "Ajuste", reason: "Anulación " + current.folio, sale: current.id, timestamp: new Date().toISOString() }],
    stock: [...demo.stock, ...demo.stock.filter((item) => item.source === current.id && item.kind === "Venta").map((item) => ({ ...item, id: item.id + "-reversa", delta: -item.delta, kind: "Devolución", date }))],
    earnings: [...demo.earnings, ...demo.earnings.filter((item) => item.sale === current.id).map((item) => ({ ...item, id: item.id + "-ajuste", base: -item.base, commission: -item.commission, tip: -item.tip, adjustment: true, date }))],
  };
}

export function newSale(demo: Demo, appointment?: DemoAppointment, id = uuid()): Sale {
  const existing = appointment && demo.sales.find((item) => item.appointment === appointment.id && item.status !== "Anulada");
  if (existing) return existing;
  const branch = appointment?.branch ?? demo.branch;
  const folio = "MJ-" + String(demo.sales.length + 1).padStart(4, "0");
  const date = todayAt(byId(demo.branches, branch)?.zone ?? demo.business.zone);
  return {
    id, folio, date, branch, staff: appointment?.staff ?? "", client: appointment?.client ?? "", appointment: appointment?.id ?? "",
    lines: appointment ? [{ kind: "service", item: appointment.service, name: appointment.label, quantity: 1, unit: Math.round(appointment.price * 100) }] : [],
    tip: 0, status: "Borrador",
  };
}
