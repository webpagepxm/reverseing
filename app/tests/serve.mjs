import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve("out");
const port = Number(process.env.MAMBO_PORT ?? 3100);
const base = "/reverseing";
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".txt": "text/plain", ".json": "application/json", ".woff2": "font/woff2", ".svg": "image/svg+xml" };

createServer(async (request, response) => {
  let file;
  try {
    const path = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (path !== base && !path.startsWith(base + "/")) throw new Error("Outside base path");
    file = resolve(root, "." + path.slice(base.length) + (path.endsWith("/") ? "index.html" : ""));
    if (file !== root && !file.startsWith(root + sep)) throw new Error("Outside export directory");
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    await stat(file);
  } catch {
    response.statusCode = 404;
    file = resolve(root, "404.html");
  }
  response.setHeader("Content-Type", mime[extname(file)] ?? "application/octet-stream");
  createReadStream(file).on("error", () => response.end()).pipe(response);
}).listen(port, "127.0.0.1");
