// Speicher: Upstash Redis (über den Vercel Marketplace verbunden).
// Ohne Zugangsdaten (nur lokal zum Testen) wird ein Speicher im Arbeitsspeicher genutzt.
import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const RESP = "zv:responses"; // Hash: id -> Antwort (JSON)
const TOKENS = "zv:tokens";  // Hash: id -> Bearbeitungs-Token

let redis = null;
if (url && token) redis = new Redis({ url, token });
else if (process.env.VERCEL) throw new Error("Datenbank fehlt: bitte Upstash Redis im Vercel-Projekt verbinden.");

const mem = { [RESP]: new Map(), [TOKENS]: new Map() };

export async function getToken(id) {
  if (redis) return redis.hget(TOKENS, id);
  return mem[TOKENS].get(id) ?? null;
}
export async function save(id, tok, data) {
  if (redis) { await redis.hset(RESP, { [id]: JSON.stringify(data) }); await redis.hset(TOKENS, { [id]: tok }); return; }
  mem[RESP].set(id, JSON.stringify(data)); mem[TOKENS].set(id, tok);
}
export async function all() {
  const raw = redis ? (await redis.hgetall(RESP)) || {} : Object.fromEntries(mem[RESP]);
  return Object.entries(raw).map(([id, v]) => ({ ...(typeof v === "string" ? JSON.parse(v) : v), _id: id }));
}
export async function clear() {
  if (redis) { await redis.del(RESP, TOKENS); return; }
  mem[RESP].clear(); mem[TOKENS].clear();
}
