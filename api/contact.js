function clean(value, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function reply(res, status, body) { return res.status(status).json(body); }
export default async function handler(req, res) {
  if (req.method !== "POST") return reply(res, 405, { error: "Method not allowed" });
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host && new URL(origin).host !== host) return reply(res, 403, { error: "Origin not allowed." });
  if (clean(req.body?.website, 200)) return reply(res, 200, { ok: true });
  const name = clean(req.body?.name, 120);
  const email = clean(req.body?.email, 200).toLowerCase();
  const phone = clean(req.body?.phone, 50);
  const service = clean(req.body?.service, 120);
  const message = clean(req.body?.message, 2500);
  const company = clean(req.body?.company, 150);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !["Luxury interiors","Acoustic solutions","Architectural lighting","Construction & refurbishment","Integrated project / consultation"].includes(service) || !message) return reply(res, 400, { error: "Please complete the required fields with a valid email." });
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return reply(res, 503, { error: "CRM capture is not configured. Use the WhatsApp enquiry instead." });
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const [firstName, ...lastParts] = name.split(/\s+/);
  const properties = {
    firstname: firstName,
    lastname: lastParts.join(" "),
    email,
    ...(phone ? { phone } : {}),
    ...(company ? { company } : {}),
    lifecyclestage: "lead"
  };
  try {
    const lookup = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST", headers,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }], properties: ["email"], limit: 1 })
    });
    if (!lookup.ok) return reply(res, 502, { error: "Could not check for an existing CRM contact." });
    const found = await lookup.json();
    let contactId, method;
    if (found.results?.length) {
      contactId = found.results[0].id;
      method = "matched";
    } else {
      const create = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", { method: "POST", headers, body: JSON.stringify({ properties }) });
      if (!create.ok) return reply(res, 502, { error: "Could not create the CRM contact. Check the token's contact-write permission." });
      const created = await create.json();
      contactId = created.id;
      method = "created";
    }
    const noteBody = `Website enquiry — ${service}\n\n${message}\n\nSource: Colorful Homes website`;
    const note = await fetch("https://api.hubapi.com/crm/v3/objects/notes", {
      method: "POST", headers,
      body: JSON.stringify({ properties: { hs_timestamp: new Date().toISOString(), hs_note_body: noteBody }, associations: [{ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }] })
    });
    if (!note.ok) return reply(res, 207, { ok: true, contactSaved: true, noteSaved: false, message: "Contact saved; project enquiry note could not be attached. Please review CRM permissions." });
    return reply(res, 200, { ok: true, contactSaved: true, noteSaved: true, action: method });
  } catch {
    return reply(res, 502, { error: "CRM service is temporarily unavailable." });
  }
}
