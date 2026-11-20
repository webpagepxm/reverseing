import { expect, test, type Page } from "@playwright/test";

const base = "/reverseing/b/estudio-mambo/s/roma-norte/";
const route = (path: string) => base + path + "/";
const nav = (page: Page, name: string) => page.getByRole("navigation", { name: "Módulos" }).getByRole("link", { name, exact: true });
const submenu = (page: Page, name: string) => page.getByRole("navigation", { name: /^Secciones de / }).getByRole("link", { name, exact: true });
const dialog = (page: Page) => page.getByRole("dialog");
const button = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
const capture = async (page: Page, name: string) => {
  if (process.env.MAMBO_CAPTURE) {
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: "review/v2/" + name + ".png" });
  }
};
const confirm = (page: Page) => page.once("dialog", (entry) => entry.accept());
const snapshot = (page: Page) => page.evaluate(() => JSON.parse(localStorage.getItem("mambo-jambo.demo.v2") ?? "null"));

async function openCash(page: Page, amount = "2000") {
  await page.goto(route("ventas/caja"));
  await button(page, "Abrir caja").click();
  await dialog(page).getByLabel("Efectivo inicial (MXN)").fill(amount);
  await button(page, "Confirmar apertura").click();
  await expect(dialog(page)).toHaveCount(0);
}

async function appointment(page: Page, name: string, at: string, client?: string) {
  await button(page, "Nueva cita").click();
  const editor = dialog(page);
  await editor.getByRole("combobox", { name: "Servicio", exact: true }).selectOption({ label: name });
  await editor.getByLabel("Hora", { exact: true }).fill(at);
  if (client) await editor.getByRole("combobox", { name: "Cliente (opcional)", exact: true }).selectOption({ label: client });
  await button(page, "Añadir cita de prueba").click();
  await expect(editor).toHaveCount(0);
}

test("navegación global, enlaces directos, calendario, teclado y filtros", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto("/reverseing/");
  await expect(page).toHaveURL(new RegExp(route("inicio") + "$"));
  for (const [name, heading] of [["Agenda", "Agenda"], ["Ventas", "Resumen de ventas"], ["Clientes", "Clientes"], ["Catálogo", "Servicios"], ["Equipo", "Miembros"], ["Informes", "Biblioteca de informes"], ["Configuración", "Negocio"]]) {
    await nav(page, name).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
  await nav(page, "Agenda").click();
  await capture(page, "agenda");
  const event = page.getByRole("button", { name: /Alba Torres, Corte y estilo/ });
  await event.click();
  await expect(dialog(page)).toContainText("09:30–10:30");
  await capture(page, "detalle-cita");
  await page.keyboard.press("Escape");
  await expect(event).toBeFocused();
  await button(page, "Semana").click();
  await page.getByRole("combobox", { name: "Empleado", exact: true }).selectOption("luna");
  await expect(page.getByRole("heading", { name: /16.*22/ })).toBeVisible();
  await button(page, "Lista").click();
  await page.getByLabel("Fecha de agenda").fill("2026-11-25");
  await expect(page.getByRole("heading", { name: "No hay citas en este día" })).toBeVisible();
  await button(page, "Ver día de muestra").click();
  await expect(page.getByRole("button", { name: /Sofía Luna/ })).toBeVisible();
  await nav(page, "Clientes").click();
  await page.getByRole("searchbox").fill("nicolas");
  await expect(button(page, "Nicolás Ávila")).toBeVisible();
  await expect(button(page, "Alba Torres")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("A · clientes, servicios, turnos y ciclo de cita persistente", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(route("clientes"));
  await button(page, "Nuevo cliente").click();
  await dialog(page).getByLabel("Nombre", { exact: true }).fill("Ada");
  await dialog(page).getByLabel("Apellidos").fill("Demo");
  await dialog(page).getByLabel("Correo", { exact: true }).fill("ada@example.test");
  await button(page, "Guardar").click();
  await button(page, "Ada Demo").click();
  await button(page, "Editar cliente").click();
  await dialog(page).getByLabel("Notas").fill("Prefiere turno de tarde");
  await button(page, "Guardar").click();
  await expect(button(page, "Ada Demo")).toBeVisible();
  await capture(page, "clientes");
  await nav(page, "Catálogo").click();
  await button(page, "Nuevo servicio").click();
  await dialog(page).getByLabel("Nombre", { exact: true }).fill("Corte E2E");
  await dialog(page).getByLabel("Categoría").fill("Pruebas");
  await dialog(page).getByLabel("Inés Mora").check();
  await dialog(page).getByLabel("Precio (MXN)").fill("25");
  await button(page, "Guardar").click();
  await button(page, "Corte E2E").click();
  await button(page, "Editar servicio").click();
  await dialog(page).getByLabel("Duración en minutos").fill("45");
  await button(page, "Guardar").click();
  await nav(page, "Equipo").click();
  await submenu(page, "Turnos").click();
  await button(page, "Nuevo turno").click();
  await dialog(page).getByRole("combobox", { name: "Profesional", exact: true }).selectOption("ines");
  await dialog(page).getByLabel("Vigente desde").fill("2026-11-18");
  await dialog(page).getByLabel("Fin").fill("19:00");
  await button(page, "Guardar").click();
  await expect(dialog(page)).toHaveCount(0);
  await nav(page, "Agenda").click();
  await button(page, "Nueva cita").click();
  const editor = dialog(page);
  await editor.getByRole("combobox", { name: "Servicio", exact: true }).selectOption("corte");
  await button(page, "Añadir cita de prueba").click();
  await expect(editor.getByRole("alert")).toContainText("se cruza");
  await editor.getByLabel("Hora", { exact: true }).fill("08:30");
  await button(page, "Añadir cita de prueba").click();
  await expect(editor.getByRole("alert")).toContainText("fuera del turno");
  await editor.getByLabel("Hora", { exact: true }).fill("15:00");
  await editor.getByRole("combobox", { name: "Servicio", exact: true }).selectOption({ label: "Corte E2E · 45 min" });
  await editor.getByRole("combobox", { name: "Cliente (opcional)", exact: true }).selectOption({ label: "Ada Demo" });
  await capture(page, "editor-cita");
  await button(page, "Añadir cita de prueba").click();
  await expect(page.getByRole("status")).toContainText("Cita de demostración añadida");
  await page.reload();
  await page.getByRole("button", { name: "Ada Demo, Corte E2E, 15:00" }).click();
  await button(page, "Editar o reprogramar").click();
  await dialog(page).getByLabel("Hora", { exact: true }).fill("16:00");
  await button(page, "Guardar cambios").click();
  await page.getByRole("button", { name: "Ada Demo, Corte E2E, 16:00" }).click();
  await dialog(page).getByRole("link", { name: "Ficha del cliente" }).click();
  await button(page, "Citas").click();
  await dialog(page).getByRole("link", { name: "Corte E2E" }).click();
  await expect(dialog(page)).toContainText("16:00–16:45");
  confirm(page);
  await button(page, "Cancelar cita").click();
  await expect(dialog(page)).toContainText("Cancelada");
  await page.reload();
  await expect(dialog(page)).toContainText("Cancelada");
  await button(page, "Cerrar panel").click();
  await appointment(page, "Corte E2E · 45 min", "16:00");
  expect((await snapshot(page)).appointments.filter((item: { status: string; minute: number; label: string }) => item.label === "Corte E2E" && item.minute === 960).length).toBe(2);
});

test("B · cita, POS, efectivo, movimientos, arqueo e informe", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(route("ventas/nueva"));
  await page.getByRole("button", { name: /Agregar Corte de prueba/ }).click();
  await page.getByLabel("Efectivo recibido (MXN)").fill("40");
  await button(page, "Confirmar efectivo simulado").click();
  await expect(page.getByRole("alert").filter({ hasText: "Abre una sesión" })).toBeVisible();
  await openCash(page);
  for (const [action, amount, reason] of [["Entrada de efectivo", "200", "Fondo"], ["Salida de efectivo", "50", "Gastos"]]) {
    await button(page, action).click();
    await dialog(page).getByLabel("Importe (MXN)").fill(amount);
    await dialog(page).getByLabel("Motivo").fill(reason);
    await button(page, "Confirmar movimiento").click();
  }
  await page.goto(route("agenda"));
  await appointment(page, "Corte de prueba · 25 MXN · 90 min", "15:00");
  await page.getByRole("button", { name: /Sin cliente, Corte de prueba/ }).click();
  await dialog(page).getByRole("link", { name: "Cobrar cita" }).click();
  await page.getByLabel("Propina (MXN)").fill("6.25");
  await page.getByLabel("Efectivo recibido (MXN)").fill("40");
  await capture(page, "pos");
  await expect(page.getByText("$31.25", { exact: true })).toBeVisible();
  await expect(page.getByText("$8.75", { exact: true })).toBeVisible();
  await button(page, "Guardar borrador").click();
  await page.reload();
  await expect(page.getByLabel("Propina (MXN)")).toHaveValue("6.25");
  await page.getByLabel("Efectivo recibido (MXN)").fill("40");
  await button(page, "Confirmar efectivo simulado").dblclick();
  await expect(page.getByText(/Recibo de demostración/)).toBeVisible();
  await expect(page.getByText("$8.75", { exact: true })).toBeVisible();
  const state = await snapshot(page);
  const [sale] = state.sales.filter((item: { branch: string }) => item.branch === "roma-norte");
  const [session] = state.sessions.filter((item: { branch: string }) => item.branch === "roma-norte");
  const payments = state.payments.filter((item: { sale: string }) => item.sale === sale.id);
  expect(payments).toHaveLength(1);
  expect(state.sales).toHaveLength(2);
  expect(payments[0]).toMatchObject({ amount: 3125, received: 4000, change: 875, sale: sale.id, session: session.id });
  expect(state.appointments.find((item: { id: string }) => item.id === sale.appointment).status).toBe("Reservada");
  await page.goto(route("ventas"));
  await expect(button(page, "MJ-0002")).toBeVisible();
  await page.goto(route("ventas/caja"));
  await expect(page.getByText("$2,181.25", { exact: true })).toHaveCount(2);
  await button(page, "Actividad").click();
  await expect(page.getByText("Venta · MJ-0002", { exact: true })).toBeVisible();
  await capture(page, "caja-abierta");
  await button(page, "Arqueo y cierre").click();
  await dialog(page).getByLabel("Efectivo contado (MXN)").fill("2000");
  await dialog(page).getByLabel("Efectivo retenido (MXN)").fill("1800");
  await dialog(page).getByLabel("Efectivo retirado (MXN)").fill("200");
  await capture(page, "arqueo");
  await button(page, "Confirmar cierre").click();
  await expect(dialog(page).getByRole("alert")).toContainText("motivo de la diferencia");
  await dialog(page).getByLabel("Motivo de diferencia").fill("Diferencia ficticia");
  await button(page, "Confirmar cierre").click();
  await expect(dialog(page)).toHaveCount(0);
  expect((await snapshot(page)).sessions.find((item: { id: string }) => item.id === session.id)).toMatchObject({ expected: 218125, counted: 200000, kept: 180000, withdrawn: 20000 });
  await button(page, "Abrir caja").click();
  await expect(dialog(page).getByLabel("Efectivo inicial (MXN)")).toHaveValue("1800");
  await button(page, "Cerrar panel").click();
  await page.goto(route("informes/ventas"));
  await expect(page.getByText("$31.25", { exact: true })).toHaveCount(2);
  await capture(page, "informes");
});

test("C · proveedor, producto, pedido parcial, venta física y recuento", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(route("catalogo/proveedores"));
  await button(page, "Nuevo proveedor").click();
  await dialog(page).getByLabel("Nombre", { exact: true }).fill("Proveedor E2E");
  await button(page, "Guardar").click();
  await submenu(page, "Productos").click();
  await button(page, "Nuevo producto").click();
  const editor = dialog(page);
  await editor.getByLabel("Nombre", { exact: true }).fill("Articuló E2E");
  await editor.getByLabel("SKU").fill("PRUEBA-E2E");
  await editor.getByLabel("Categoría").fill("Cabello");
  await editor.getByLabel("Precio (MXN)").fill("123");
  await editor.getByLabel("Stock inicial").fill("12");
  await editor.getByRole("combobox", { name: "Proveedor", exact: true }).selectOption({ label: "Proveedor E2E" });
  await button(page, "Guardar").click();
  await expect(page.getByRole("row", { name: /Articuló E2E/ })).toContainText("12");
  await capture(page, "productos");
  await submenu(page, "Pedidos").click();
  await button(page, "Nuevo pedido").click();
  await editor.getByRole("combobox", { name: "Proveedor", exact: true }).selectOption({ label: "Proveedor E2E" });
  await editor.getByLabel("Cantidad de Articuló E2E").fill("4");
  await button(page, "Crear pedido").click();
  await button(page, "Proveedor E2E").click();
  for (const amount of ["1", "3"]) {
    await button(page, "Registrar recepción").click();
    await editor.getByLabel("Recibir Articuló E2E").fill(amount);
    await button(page, "Confirmar recepción").click();
    await expect(editor).toContainText(amount === "1" ? "Recepción parcial" : "Recibido");
  }
  await openCash(page);
  await page.goto(route("ventas/nueva"));
  await button(page, "Productos").click();
  await button(page, "Agregar Articuló E2E").click();
  await page.getByLabel("Efectivo recibido (MXN)").fill("150");
  await button(page, "Confirmar efectivo simulado").click();
  await expect(page.getByText(/Recibo de demostración/)).toBeVisible();
  await page.goto(route("catalogo/inventario"));
  await expect(page.getByRole("row", { name: /Articuló E2E/ })).toContainText("15");
  await button(page, "Articuló E2E").click();
  await expect(dialog(page).getByText("Venta", { exact: true })).toBeVisible();
  await capture(page, "inventario");
  await button(page, "Cerrar panel").click();
  await submenu(page, "Recuentos").click();
  await button(page, "Nuevo recuento").click();
  await editor.getByRole("combobox", { name: "Producto", exact: true }).selectOption({ label: "Articuló E2E" });
  await button(page, "Guardar").click();
  await button(page, "Articuló E2E").click();
  await button(page, "Iniciar conteo").click();
  await button(page, "Registrar conteo").click();
  await editor.getByLabel("Cantidad contada").fill("14");
  await button(page, "Enviar a revisión").click();
  confirm(page);
  await button(page, "Aplicar recuento").click();
  await expect(editor).toContainText("Aplicado");
  const state = await snapshot(page);
  const product = state.products.find((item: { sku: string }) => item.sku === "PRUEBA-E2E");
  expect(state.stock.filter((item: { product: string; kind: string }) => item.product === product.id && item.kind === "Recuento")).toHaveLength(1);
});

test("D y E · comisión, liquidación, segmento y restablecimiento", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 950 });
  await page.goto(route("equipo/comisiones"));
  await button(page, "Nueva regla").click();
  await dialog(page).getByRole("combobox", { name: "Profesional", exact: true }).selectOption("luna");
  await button(page, "Guardar").click();
  await expect(button(page, "Luna Reyes")).toBeVisible();
  await openCash(page);
  await page.goto(route("ventas/nueva"));
  await page.getByRole("button", { name: /Agregar Corte de prueba/ }).click();
  await page.getByRole("combobox", { name: "Profesional", exact: true }).selectOption("luna");
  await page.getByRole("combobox", { name: "Cliente", exact: true }).selectOption("alba");
  await page.getByLabel("Propina (MXN)").fill("6.25");
  await page.getByLabel("Efectivo recibido (MXN)").fill("40");
  await button(page, "Confirmar efectivo simulado").click();
  await expect(page.getByText(/Recibo de demostración/)).toBeVisible();
  await page.goto(route("equipo/comisiones"));
  await expect(page.getByText("$5.00", { exact: true })).toHaveCount(2);
  await capture(page, "comisiones");
  await submenu(page, "Liquidaciones").click();
  await button(page, "Nueva liquidación").click();
  await dialog(page).getByRole("combobox", { name: "Profesional", exact: true }).selectOption("luna");
  await button(page, "Guardar").click();
  await page.getByRole("row", { name: /Luna Reyes.*Borrador/ }).getByRole("button", { name: "Luna Reyes" }).click();
  await expect(dialog(page)).toContainText("$11.25");
  await button(page, "Marcar revisada").click();
  confirm(page);
  await button(page, "Aprobar liquidación").click();
  await button(page, "Registrar pago externo simulado").click();
  await dialog(page).getByLabel("Referencia de demostración").fill("DEMO-001");
  await button(page, "Registrar referencia").click();
  await expect(dialog(page)).toContainText("Pago registrado");
  await page.goto(route("clientes/segmentos"));
  await button(page, "Nuevo segmento").click();
  await dialog(page).getByLabel("Nombre").fill("Con compras");
  await expect(dialog(page).getByRole("status")).toContainText("1 cliente");
  await button(page, "Guardar").click();
  await button(page, "Con compras").click();
  await expect(dialog(page).getByRole("button", { name: "Alba Torres" })).toBeVisible();
  await page.reload();
  await expect(dialog(page).getByRole("button", { name: "Alba Torres" })).toBeVisible();
  await page.goto(route("configuracion/preferencias"));
  confirm(page);
  await button(page, "Restablecer demostración").click();
  await expect.poll(async () => (await snapshot(page)).sales.length).toBe(1);
  expect((await snapshot(page)).segments).toHaveLength(1);
});

for (const width of [360, 390, 768, 1024, 1280, 1440]) {
  test("diseño adaptable y recursos estáticos a " + width + " px", async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const assetFailures: string[] = [];
    page.on("response", (response) => { if (response.url().includes("/_next/") && response.status() >= 400) assetFailures.push(response.url()); });
    for (const [path, heading] of [["agenda", "Agenda"], ["ventas/nueva", "Nueva venta"], ["ventas/caja", "Caja"], ["catalogo/productos", "Productos"]]) {
      const response = await page.goto(route(path));
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
    expect(assetFailures).toEqual([]);
    if (width <= 390) {
      await button(page, "Módulos").click();
      if (width === 390) await capture(page, "navegacion-movil");
      await nav(page, "Agenda").click();
      await expect(button(page, "Lista")).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: /Alba Torres/ }).click();
      await expect(dialog(page)).toBeVisible();
      if (width === 390) await capture(page, "cita-movil");
    }
  });
}
