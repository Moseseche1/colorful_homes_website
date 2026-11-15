import { validSession } from "./_session.js";
export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!validSession(req)) return res.status(401).json({ error: "Please sign in again." });
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: "HubSpot connection is not configured." });
  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        filterGroups: [],
        sorts: [{ propertyName: "createdate", direction: "DESCENDING" }],
        properties: ["firstname", "lastname", "email", "phone", "company", "lifecyclestage", "hs_lead_status", "createdate", "lastmodifieddate"],
        limit: 100
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      return res.status(response.status).json({ error: response.status === 403 ? "HubSpot token needs contacts read permission." : "Could not retrieve CRM contacts.", detail: detail.slice(0, 300) });
    }
    const data = await response.json();
    const contacts = (data.results || []).map(row => ({
      id: row.id,
      name: [row.properties.firstname, row.properties.lastname].filter(Boolean).join(" ") || "Unnamed contact",
      email: row.properties.email || "",
      phone: row.properties.phone || "",
      company: row.properties.company || "",
      stage: row.properties.hs_lead_status || row.properties.lifecyclestage || "Unclassified",
      created: row.properties.createdate || ""
    }));
    return res.status(200).json({ totalReturned: contacts.length, contacts, hasMore: Boolean(data.paging?.next), note: "Showing the latest 100 contacts available to this HubSpot token." });
  } catch {
    return res.status(502).json({ error: "HubSpot could not be reached. Please try again." });
  }
}
