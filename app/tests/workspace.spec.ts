import { expect, test, type Page } from "@playwright/test";

const agenda = "/b/estudio-mambo/s/roma-norte/agenda";

async function noGlobalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
}

test("navega entre módulos, submenús y fichas", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 980 });
  await page.goto("/");
  await expect(page).toHaveURL(new RegExp(agenda + "$"));
  const navigation = page.getByRole("navigation", { name: "Módulos" });
  await navigation.getByRole("link", { name: "Clientes" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Clientes");
  await page.getByRole("searchbox").fill("nicolas");
  const record = page.getByRole("button", { name: "Nicolás Ávila" });
  await record.click();
  const panel = page.getByRole("dialog", { name: "Ficha de cliente" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "Citas" }).click();
  await expect(panel.getByText("Corte clásico")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(record).toBeFocused();
  await expect(page.getByRole("searchbox")).toHaveValue("nicolas");
  await page.getByRole("searchbox").fill("sin coincidencia");
  await expect(page.getByRole("heading", { name: "No hay coincidencias" })).toBeVisible();
  await page.getByRole("button", { name: "Restablecer filtros" }).click();
  await expect(page.getByRole("table")).toBeVisible();

  await navigation.getByRole("link", { name: "Catálogo" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Servicios");
  await page.getByRole("button", { name: "Barbería", exact: true }).click();
  await expect(page.getByRole("row")).toHaveCount(3);
  await page.getByRole("button", { name: "Diseño de barba" }).click();
  await expect(page.getByRole("dialog")).toContainText("45 min");
  await page.goBack();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await navigation.getByRole("link", { name: "Equipo" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Miembros");
  await page.getByRole("link", { name: "Turnos" }).click();
  await page.getByLabel("Empleado de turnos").selectOption("ines");
  await expect(page.getByRole("row")).toHaveCount(2);
  await navigation.getByRole("link", { name: "Configuración" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Negocio");
  await page.getByRole("link", { name: "Sucursales" }).click();
  await expect(page.getByText("America/Mexico_City")).toBeVisible();
  await page.getByRole("link", { name: "Accesos" }).click();
  await expect(page.getByRole("heading", { name: "Perfiles de ejemplo" })).toBeVisible();
  await navigation.getByRole("link", { name: "Agenda" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Agenda");
});

test("cambia fecha, profesional y vista y conserva contexto del detalle", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 980 });
  await page.goto(agenda);
  await expect(page.getByRole("button", { name: "Día", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Semana", exact: true }).click();
  await expect(page.getByRole("heading", { name: /16.*22/ })).toBeVisible();
  await page.getByLabel("Empleado", { exact: true }).selectOption("luna");
  await expect(page.getByRole("button", { name: /Renata Silva, Corte y estilo/ })).toBeVisible();
  await page.getByRole("button", { name: "Lista", exact: true }).click();
  const appointment = page.getByRole("button", { name: /Sofía Luna/ });
  await appointment.click();
  await expect(page.getByRole("dialog")).toContainText("Tratamiento hidratante");
  await page.getByRole("button", { name: "Cerrar panel" }).click();
  await expect(appointment).toBeFocused();
  await expect(page.getByLabel("Empleado", { exact: true })).toHaveValue("luna");
  await page.getByLabel("Fecha de agenda").fill("2026-11-25");
  await expect(page.getByRole("heading", { name: "No hay citas en este día" })).toBeVisible();
  await page.getByRole("button", { name: "Ver día de muestra" }).click();
  await expect(appointment).toBeVisible();
  await page.getByRole("button", { name: "Período siguiente" }).click();
  await expect(page.getByLabel("Fecha de agenda")).toHaveValue("2026-11-19");
  await page.getByRole("button", { name: "Período anterior" }).click();
  await expect(page.getByLabel("Fecha de agenda")).toHaveValue("2026-11-18");
  expect((await page.request.get(agenda + "/ventas")).status()).toBe(404);
  await noGlobalOverflow(page);
});

test("valida el solape y añade una cita temporal sin cliente", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 980 });
  await page.goto(agenda);
  const slot = page.getByRole("button", { name: /Nueva cita: Mateo Cruz.*12:00/ });
  await slot.click();
  const slotEditor = page.getByRole("dialog", { name: "Nueva cita" });
  await expect(slotEditor.getByRole("combobox", { name: "Hora", exact: true })).toHaveValue("720");
  await expect(slotEditor.getByRole("combobox", { name: "Profesional" })).toHaveValue("mateo");
  await slotEditor.getByRole("button", { name: "Cancelar" }).click();
  await expect(slot).toBeFocused();
  await page.getByRole("button", { name: /^Nueva cita$/ }).click();
  const panel = page.getByRole("dialog", { name: "Nueva cita" });
  await panel.getByLabel("Servicio").selectOption("corte");
  if (process.env.MAMBO_CAPTURE) await page.screenshot({ path: "review/editor-1280.png" });
  await panel.getByRole("button", { name: "Añadir cita de prueba" }).click();
  await expect(panel.getByRole("alert")).toContainText("se cruza con otra cita");
  await panel.getByRole("combobox", { name: "Hora", exact: true }).selectOption("900");
  await panel.getByRole("button", { name: "Añadir cita de prueba" }).click();
  await expect(panel.getByRole("status")).toContainText("Añadiendo");
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("status")).toContainText("Cita de demostración añadida.");
  const item = page.getByRole("button", { name: "Sin cliente, Corte y estilo, 15:00" });
  await expect(item).toBeFocused();
  await item.click();
  await expect(page.getByRole("dialog")).toContainText("15:00–16:00");
  await page.goto(agenda);
  await expect(item).toHaveCount(0);
});

for (const width of [360, 768, 1280]) {
  test(`revisa Agenda y el panel a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 360 ? 850 : 1100 });
    await page.goto(agenda);
    await expect(page.getByRole("button", { name: width === 360 ? "Lista" : "Día", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.evaluate(() => document.fonts.ready);
    await noGlobalOverflow(page);
    if (process.env.MAMBO_CAPTURE) await page.screenshot({ path: `review/agenda-${width}.png`, fullPage: true });
    await page.getByRole("button", { name: /Alba Torres/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await noGlobalOverflow(page);
    if (process.env.MAMBO_CAPTURE && width !== 768) await page.screenshot({ path: `review/cita-${width}.png` });
    await page.getByRole("button", { name: "Cerrar panel" }).click();
    if (width === 360) {
      await page.getByRole("button", { name: "Módulos", exact: true }).click();
      await page.getByRole("link", { name: "Configuración" }).click();
      await page.getByRole("button", { name: /Configuración.*Negocio/ }).click();
      await page.getByRole("link", { name: "Sucursales" }).click();
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sucursales");
      await noGlobalOverflow(page);
    }
  });
}
