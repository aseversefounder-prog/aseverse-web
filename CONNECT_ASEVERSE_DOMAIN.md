# Connect AseVerse.com

I cannot complete these steps without access to the Vercel project and the domain registrar, but the website files are ready for `aseverse.com`.

## 1. Deploy The Landing Website To Vercel

Create a new Vercel project with:

- Root Directory: `public-website`
- Framework Preset: `Other`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave blank

Deploy once before connecting the domain.

## 2. Add The Domain In Vercel

In the Vercel project:

1. Go to Settings.
2. Go to Domains.
3. Add `aseverse.com`.
4. Add `www.aseverse.com`.
5. Set `aseverse.com` as the primary domain.

## 3. Update DNS At Your Domain Registrar

Vercel will show the exact DNS records. Usually this means:

- Apex/root domain `aseverse.com`: add Vercel's recommended `A` record.
- `www.aseverse.com`: add Vercel's recommended `CNAME` record.

Use the exact values Vercel provides in the Domains screen.

## 4. Wait For Verification

DNS can update quickly, but sometimes takes a few hours. Vercel will show when the domain is valid and SSL is active.

## 5. Connect Waitlist Storage

In Vercel environment variables, add one of:

- `WAITLIST_WEBHOOK_URL`: Formspree, Airtable automation webhook, Supabase/Firebase function, Make/Zapier webhook, or your own API.
- `WAITLIST_API_KEY`: optional, only if your chosen endpoint requires a bearer token.

Without these, the waitlist form falls back to local browser storage for demos only.

## 6. Demo URL

The public site currently points demo buttons to:

`https://aseverse.com/demo`

When the app demo has its own production route, update the `aseverse-demo-url` meta tag in `index.html`.
