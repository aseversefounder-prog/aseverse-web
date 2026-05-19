# AseVerse Public Website

This folder contains the standalone public landing website for AseVerse.

## Local Preview

From this folder:

```powershell
npm install
npm run dev
```

If you do not want to install Vercel locally, any static server can serve this folder. The waitlist form will fall back to browser local storage when `/api/waitlist` is not connected.

## Deployment To Vercel

1. Create a new Vercel project.
2. Set the project root directory to `public-website`.
3. Use these settings:
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: leave blank
   - Install Command: `npm install`
4. Add environment variables from `.env.example` if you connect a real waitlist provider.
5. Deploy.

## Waitlist Options

The form posts to `/api/waitlist`.

For now, the API route is a placeholder that forwards submissions to `WAITLIST_WEBHOOK_URL` when configured. Good options:

- Formspree: set `WAITLIST_WEBHOOK_URL` to your Formspree endpoint.
- Airtable: connect an automation webhook or small API wrapper.
- Supabase: create a table and point to a Supabase Edge Function.
- Firebase: point to a Firebase Function.
- Google Forms: use a small Apps Script or webhook bridge.

Without an endpoint, the browser stores demo submissions in local storage only.

## Custom Domain: aseverse.com

See `CONNECT_ASEVERSE_DOMAIN.md` for the short deployment checklist.

In Vercel:

1. Open the AseVerse project.
2. Go to Settings -> Domains.
3. Add `aseverse.com`.
4. Add `www.aseverse.com` too.
5. In your domain registrar DNS, point:
   - Apex `aseverse.com` to Vercel using the records Vercel shows.
   - `www` CNAME to Vercel using the value Vercel shows.
6. Wait for DNS verification.
7. Set `aseverse.com` as the primary domain.

Recommended later:

- Put the app demo on `demo.aseverse.com` or `/demo`.
- Update the `aseverse-demo-url` meta tag in `index.html` to the production demo URL.
