import crypto from "node:crypto";

const COOKIE = "ch_admin";
const HOURS = 8;
function safeEqual(a, b) {
  const left = Buffer.from(String(a || ""));
  const right = Buffer.from(String(b || ""));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { ADMIN_PASSWORD, SESSION_SECRET } = process.env;
  if (!ADMIN_PASSWORD || !SESSION_SECRET) return res.status(503).json({ error: "Admin access is not configured yet." });
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!safeEqual(password, ADMIN_PASSWORD)) return res.status(401).json({ error: "Incorrect password." });
  const expires = Date.now() + HOURS * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ exp: expires, scope: "leads:read" })).toString("base64url");
  const token = payload + "." + sign(payload, SESSION_SECRET);
  res.setHeader("Set-Cookie", `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=${HOURS * 3600}`);
  return res.status(200).json({ ok: true, expiresAt: expires });
}
