// GET    /api/admin  -> alle Antworten (Gesamtauswertung, CSV)
// DELETE /api/admin  -> alle Antworten löschen
// Beide nur mit Header "Authorization: Bearer <ADMIN_KEY>" (Umgebungsvariable in Vercel).
import crypto from "node:crypto";
import { all, clear } from "../lib/store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  const key = process.env.ADMIN_KEY || (process.env.VERCEL ? "" : "test");
  const given = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!key || key.length < 8 && process.env.VERCEL) return res.status(500).json({ error: "ADMIN_KEY ist nicht gesetzt (mind. 8 Zeichen)." });
  if (!same(key, given)) { await new Promise((r) => setTimeout(r, 600)); return res.status(401).json({ error: "Schlüssel falsch." }); }
  try {
    if (req.method === "GET") return res.status(200).json({ responses: await all() });
    if (req.method === "DELETE") { await clear(); return res.status(200).json({ ok: true }); }
    return res.status(405).json({ error: "Nur GET oder DELETE." });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Datenbankfehler." });
  }
}
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
