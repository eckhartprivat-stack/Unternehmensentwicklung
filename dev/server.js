// Nur zum lokalen Testen: ahmt Vercel nach (statische Dateien aus public/, Funktionen aus api/).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const handlers = {
  submit: (await import("../api/submit.js")).default,
  results: (await import("../api/results.js")).default,
  admin: (await import("../api/admin.js")).default,
};
http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://x");
  const m = u.pathname.match(/^\/api\/(\w+)$/);
  if (m && handlers[m[1]]) {
    let raw = ""; for await (const c of req) raw += c;
    req.query = Object.fromEntries(u.searchParams);
    try { req.body = raw ? JSON.parse(raw) : undefined; } catch { req.body = raw; }
    res.status = (c) => { res.statusCode = c; return res; };
    res.json = (o) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(o)); };
    return handlers[m[1]](req, res);
  }
  const f = path.join(ROOT, "public", u.pathname === "/" ? "index.html" : u.pathname);
  if (!f.startsWith(path.join(ROOT, "public")) || !fs.existsSync(f)) { res.statusCode = 404; return res.end("404"); }
  res.end(fs.readFileSync(f));
}).listen(process.env.PORT || 3000, () => console.log("http://localhost:" + (process.env.PORT || 3000)));
