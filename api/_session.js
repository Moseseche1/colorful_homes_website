import crypto from "node:crypto";
export function validSession(req) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  const raw = (req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith("ch_admin="))?.slice(9);
  if (!raw) return false;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const a = Buffer.from(signature), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.scope === "leads:read" && data.exp > Date.now();
  } catch { return false; }
}
