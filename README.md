# Colorful Homes Construction Company

Premium responsive website and lead-generation foundation for Colorful Homes.

## Website
- Luxury interiors, intelligent acoustics, architectural lighting, construction and refurbishment.
- Responsive navigation, accessible contact form, click-to-call and WhatsApp handoff.
- Enquiry form posts to a server-side API, requires explicit consent, and falls back to WhatsApp when CRM credentials are not configured.
- A public privacy notice explains enquiry data use and third-party services.
- Gallery images are illustrative. Replace them with approved project photography before presenting them as completed work.

## Secure lead platform
The `api/` functions provide server-side HubSpot contact upsert, project-enquiry note creation and a password-protected read-only dashboard at `/admin/login.html`. They require the Vercel Node.js serverless runtime. GitHub Pages cannot run these API functions.

### Required Vercel environment variables
- `HUBSPOT_ACCESS_TOKEN`: HubSpot private app token with `crm.objects.contacts.read`, `crm.objects.contacts.write`, and `crm.objects.notes.write`.
- `ADMIN_PASSWORD`: long, unique admin password.
- `SESSION_SECRET`: random secret with at least 32 bytes.

Set these in Vercel → Project → Settings → Environment Variables. Never put credentials in frontend code, commit them to GitHub, or send them in chat. The connected HubSpot assistant integration currently has read access only and does not grant this website's API permission automatically.

### Deploy and validate
1. Import this repository into Vercel and deploy the `main` branch.
2. Add all three environment variables above.
3. Redeploy after setting variables.
4. Test a real enquiry with an email address you control; confirm both the contact and attached enquiry note in HubSpot.
5. Open `/admin/login.html`, sign in and confirm the contact appears in the dashboard.

The dashboard displays up to the latest 100 contacts. It is a lead overview, not a full CRM replacement; no contact edit/delete or deal pipeline controls are provided.

## Domain and analytics
A custom domain and analytics provider/measurement ID have not been supplied. Do not invent either. Once the domain and hosting provider are selected, configure DNS and HTTPS in that provider's dashboard. Add analytics only after choosing the provider and its correct measurement ID, and update the site's privacy notice accordingly.

## Portfolio publishing checklist
Replace illustrative photos with approved Colorful Homes project images. For each case study, collect verified project location, scope, role, delivery dates, and client permission. Do not invent client names, budgets, performance outcomes, testimonials, or project completion claims.
