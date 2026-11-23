import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const site = process.env.MAMBO_PUBLIC_URL;
const revision = process.env.GITHUB_SHA;
assert.ok(site && revision, "Se requiere la URL pública y el SHA del workflow.");

const root = new URL(site);
const prefix = new URL("b/estudio-mambo/s/roma-norte/", root);
const browser = await chromium.launch({ executablePath: process.env.MAMBO_CHROMIUM || undefined });
try {
  const page = await browser.newPage();
  const assetErrors = [];
  const pageErrors = [];
  const loaded = new Set();
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (!url.pathname.includes("/_next/")) return;
    if (response.status() >= 400) assetErrors.push(response.url());
    const type = response.request().resourceType();
    if (response.ok() && ["script", "stylesheet", "font"].includes(type)) loaded.add(type);
  });

  for (let attempt = 0; attempt < 10; attempt++) {
    const response = await page.goto(root.href, { waitUntil: "domcontentloaded" });
    if (response?.ok() && await page.locator('meta[name="mambo-revision"]').getAttribute("content", { timeout: 1000 }).catch(() => "") === revision) break;
    assert.ok(attempt < 9, "La portada no sirve el SHA esperado.");
    await delay(6000);
  }

  for (const [path, name] of [["agenda/", "Agenda"], ["ventas/caja/", "Caja"], ["catalogo/inventario/", "Existencias"], ["informes/ventas/", "Informe de ventas"]]) {
    const url = new URL(path, prefix);
    const response = await page.goto(url.href);
    assert.equal(response?.status(), 200, url.href);
    await page.getByRole("heading", { name, exact: true, level: 1 }).waitFor();
    const reload = await page.reload();
    assert.equal(reload?.status(), 200, url.href);
    await page.getByRole("heading", { name, exact: true, level: 1 }).waitFor();
    assert.equal(await page.locator('meta[name="mambo-revision"]').getAttribute("content"), revision);
  }

  await page.goto(new URL("agenda/?cita=a1", prefix).href);
  const panel = page.getByRole("dialog", { name: "Detalle de cita" });
  await panel.waitFor();
  assert.match(await panel.innerText(), /Alba Torres/);
  const svg = await page.locator(".rail nav svg").count();
  assert.ok(svg >= 8, "Faltan iconos de navegación.");
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(assetErrors, []);
  assert.deepEqual(pageErrors, []);
  for (const type of ["script", "stylesheet", "font"]) assert.ok(loaded.has(type), `Falta recurso ${type}`);
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobileCash = await mobile.goto(new URL("ventas/caja/", prefix).href);
  assert.equal(mobileCash?.status(), 200);
  await mobile.getByRole("heading", { name: "Caja", exact: true, level: 1 }).waitFor();
  await mobile.getByRole("button", { name: "Abrir caja", exact: true }).tap();
  await mobile.getByRole("dialog", { name: "Abrir caja" }).waitFor();
  assert.equal(await mobile.getByLabel("Efectivo inicial (MXN)").getAttribute("inputmode"), "decimal");
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
  console.log(`URL pública, rutas, recursos y Caja móvil verificados para ${revision}.`);
} finally {
  await browser.close();
}
