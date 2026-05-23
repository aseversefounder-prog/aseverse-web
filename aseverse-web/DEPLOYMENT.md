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

## Waitlist

The waitlist currently redirects to the official Google Form, so no environment variables are required for launch.

Optional later:

- `WAITLIST_WEBHOOK_URL`
- `WAITLIST_API_KEY`

Use these only if switching from Google Forms to the included `/api/waitlist` placeholder.

## Domain

Connect:

- `aseverse.com`
- `www.aseverse.com`

Then follow Vercel's DNS instructions in the Domains tab.
