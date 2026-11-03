// POST /api/submit  { data, id?, token? }  ->  { id, token }
// Neue Antwort anlegen oder (mit id + token aus dem eigenen Browser) die eigene Antwort ändern.
import crypto from "node:crypto";
import { validate } from "../lib/schema.js";
import { getToken, save } from "../lib/store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Nur POST." });
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const { data, error } = validate(body && body.data);
  if (error) return res.status(400).json({ error });
  try {
    let id = null, tok = null;
    if (body.id && body.token && typeof body.id === "string" && typeof body.token === "string") {
      const known = await getToken(body.id);
      if (known && same(known, body.token)) { id = body.id; tok = body.token; }
    }
    if (!id) { id = crypto.randomUUID(); tok = crypto.randomBytes(18).toString("base64url"); }
    await save(id, tok, data);
    return res.status(200).json({ id, token: tok });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Speichern fehlgeschlagen." });
  }
}
const safeParse = (s) => { try { return JSON.parse(s); } catch { return null; } };
const same = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
