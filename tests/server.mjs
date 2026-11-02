import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = normalize(join(dirname(fileURLToPath(import.meta.url)), ".."));
const tipi = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".png": "image/png", ".svg": "image/svg+xml", ".json": "application/json" };
const port = Number(process.env.PORT || process.argv[2] || 8765);

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const path = normalize(join(root, pathname === "/" ? "/index.html" : pathname));
    if (!path.startsWith(root) || /[\\/](node_modules|\.git)[\\/]/.test(path)) throw new Error("vietato");
    const body = await readFile(path);
    res.writeHead(200, { "content-type": tipi[extname(path)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
}).listen(port, "127.0.0.1", () => console.log(`Chi ha ragione? su http://127.0.0.1:${port}/`));
