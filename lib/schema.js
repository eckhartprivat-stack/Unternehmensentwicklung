// Prüft eingehende Antworten. Muss zu AREAS / COMPANIES in public/index.html passen.
export const AREA_KEYS = ["akq", "ang", "res", "start", "op_bau", "op_qm", "op_kon", "op_pla", "ctrl", "nach", "fin", "pers", "sonst"];
export const COMPANIES = ["Adenbeck", "emproc", "emproc BPM", "emproc KOM", "Etanomics", "etm", "GKK", "HOINKA", "IAS", "ING.FTG", "Juhrig", "S+P", "WSRE", "Andere"];
export const GROUPS = ["1", "2", "3", "4", "5", "6"];
export const MIN_N = 3;

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validate(b) {
  if (!b || typeof b !== "object") return { error: "Keine Daten." };
  if (!["GF", "FE2"].includes(b.pos)) return { error: "Position fehlt." };
  if (!["P", "BB"].includes(b.feld)) return { error: "Geschäftsfeld fehlt." };
  const ges = b.ges && COMPANIES.includes(b.ges) ? b.ges : null;
  const gruppe = String(b.gruppe || "");
  if (!GROUPS.includes(gruppe)) return { error: "Gruppe fehlt." };
  const today = {};
  let sum = 0;
  for (const k of AREA_KEYS) {
    const v = Number((b.today || {})[k]) || 0;
    if (!Number.isInteger(v) || v < 0 || v > 100) return { error: "Ungültiger Prozentwert." };
    today[k] = v; sum += v;
  }
  if (sum !== 100) return { error: "Die Summe muss 100 % ergeben." };
  const ideal = {};
  for (const k of AREA_KEYS) { const v = (b.ideal || {})[k]; if (k !== "sonst" && ["mehr", "gleich", "weniger"].includes(v)) ideal[k] = v; }
  const shifts = (Array.isArray(b.shifts) ? b.shifts : []).slice(0, 3)
    .map((s) => {
      const a = AREA_KEYS.includes(s && s.a) ? s.a : "";
      const z = s && s.ziel != null && s.ziel !== "" ? Math.round(Number(s.ziel)) : null;
      return { a, ziel: a && Number.isFinite(z) && z >= 0 && z <= 100 ? z : null, t: str(s && s.t, 600) };
    })
    .filter((s) => s.a || s.t);
  return { data: { v: 1, pos: b.pos, feld: b.feld, ges, gruppe, today, sonstText: str(b.sonstText, 200), ideal, shifts, at: new Date().toISOString() } };
}
