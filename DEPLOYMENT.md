# AseVerse Web Deployment

Repository name: `aseverse-web`

## GitHub

This folder is intended to be pushed as the root of the GitHub repository:

`https://github.com/YOUR_GITHUB_USERNAME/aseverse-web`

## Vercel Settings

Use these settings when importing the GitHub repository into Vercel:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Install Command: `npm install`
- Output Directory: leave blank
- Root Directory: repository root

## Environment Variables

Optional:

- `WAITLIST_WEBHOOK_URL`
- `WAITLIST_API_KEY`

If `WAITLIST_WEBHOOK_URL` is not set, the waitlist form falls back to browser local storage for demos.

## Domain

Connect:

- `aseverse.com`
- `www.aseverse.com`

Then follow Vercel's DNS instructions in the Domains tab.
