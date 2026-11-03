// GET /api/results?gruppe=3
// Liefert die Antworten einer Gruppe ohne Position, Geschäftsfeld, Gesellschaft und Zeitpunkt,
// und erst ab MIN_N Antworten. Dazu die Heute-Werte aller (für die Vergleichslinie), ebenfalls ab MIN_N.
import { all } from "../lib/store.js";
import { GROUPS, MIN_N } from "../lib/schema.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Nur GET." });
  const g = String((req.query && req.query.gruppe) || "");
  if (!GROUPS.includes(g)) return res.status(400).json({ error: "Unbekannte Gruppe." });
  try {
    const rs = await all();
    const list = rs.filter((r) => r.gruppe === g);
    return res.status(200).json({
      n: list.length,
      total: rs.length,
      noGroup: rs.filter((r) => !r.gruppe).length,
      list: list.length >= MIN_N ? shuffle(list.map((r) => ({ today: r.today, ideal: r.ideal, shifts: r.shifts }))) : [],
      all: rs.length >= MIN_N ? rs.map((r) => ({ today: r.today })) : null,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Laden fehlgeschlagen." });
  }
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
