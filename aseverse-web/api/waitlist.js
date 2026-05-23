export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, userType, message } = request.body || {};

  if (!name || !email || !userType) {
    return response.status(400).json({ error: "Name, email, and user type are required." });
  }

  const endpoint = process.env.WAITLIST_WEBHOOK_URL;

  if (!endpoint) {
    return response.status(501).json({
      error: "WAITLIST_WEBHOOK_URL is not configured.",
      nextStep: "Connect Formspree, Google Forms, Supabase, Firebase, or Airtable."
    });
  }

  const payload = {
    name,
    email,
    userType,
    message: message || "",
    source: "aseverse.com",
    createdAt: new Date().toISOString()
  };

  const headers = {
    "Content-Type": "application/json"
  };

  if (process.env.WAITLIST_API_KEY) {
    headers.Authorization = `Bearer ${process.env.WAITLIST_API_KEY}`;
  }

  const upstream = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!upstream.ok) {
    return response.status(502).json({ error: "Waitlist provider rejected the submission." });
  }

  return response.status(200).json({ ok: true });
}
