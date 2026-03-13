# TheoSheets Landing Page — Deployment Guide

## Project Structure

```
/
├── index.html           # Landing page
├── api/
│   ├── welcome-email.html  # Welcome email template (founding list)
│   ├── subscribe.mjs    # Email signup serverless function
│   ├── unsubscribe.mjs  # Unsubscribe handler (GET ?token=xxx)
│   └── subscriber-count.mjs
├── package.json
└── DEPLOYMENT.md
```

## Environment Variables

Configure these in your Vercel project (Settings → Environment Variables):

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | Resend API key for sending emails | `re_xxxxxxxxx` |
| `EMAIL_FROM` | Sender address (verified domain) | `TheoSheets <hello@theosheets.com>` |
| `EMAIL_TO` | Your email for new subscriber notifications | `you@yourdomain.com` |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL (for live subscriber count) | `https://xxx.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token | `AXxx...` |
| `LANDING_URL` | Full URL of the landing page (for unsubscribe links) | `https://theosheets.com` |

**Note:** Without Upstash Redis, the progress indicator shows a static fallback (84/300). To enable live counting, create a free [Upstash Redis](https://upstash.com) database and add the credentials.

### Getting a Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
3. Verify your domain at [resend.com/domains](https://resend.com/domains) (required for production)
4. Use a verified domain in `EMAIL_FROM` (e.g. `hello@theosheets.com`)

## Deployment Instructions

### 1. Install Vercel CLI (optional)

```bash
npm i -g vercel
```

### 2. Deploy

**Option A — Vercel Dashboard**

1. Push this project to a Git repository (GitHub, GitLab, Bitbucket)
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repository
4. Add environment variables in project settings
5. Deploy

**Option B — Vercel CLI**

```bash
cd "g:\00_AI IN VS CODE PROJECTS\TheoSheets Landing page"
vercel
```

When prompted, add environment variables or add them later in the dashboard.

### 3. Custom Domain (theosheets.com)

1. In Vercel: Project → Settings → Domains
2. Add `theosheets.com` and `www.theosheets.com`
3. Follow DNS instructions (add A/CNAME records at your registrar)

### 4. Local Development

```bash
npm install
vercel dev
```

Visit `http://localhost:3000`. The `/api/subscribe` endpoint will run locally; ensure env vars are set (e.g. via `.env.local` or Vercel CLI).

## Configuration Notes

- **No `vercel.json` required** — Vercel auto-detects the `api/` folder and serves `index.html` at the root.
- **Static files** — `index.html` at the project root is served as the homepage.
- **API route** — `api/subscribe.js` becomes `/api/subscribe` and accepts POST requests only.
