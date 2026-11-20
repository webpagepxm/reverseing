import { defineConfig } from "@playwright/test";

const port = Number(process.env.MAMBO_PORT ?? 3100);
const executablePath = process.env.MAMBO_CHROMIUM;

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
  workers: 2,
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    browserName: "chromium",
    launchOptions: executablePath ? { executablePath } : undefined,
    locale: "es-MX",
    timezoneId: "America/Mexico_City",
  },
  webServer: {
    command: `npm run start -- --hostname 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    timeout: 45_000,
  },
});
