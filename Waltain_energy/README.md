# Waltain Energy

React + Vite website for Waltain Energy.

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node)

## Setup

npm install

## Run (development)

npm run dev

Vite will print a local URL (typically http://localhost:5173).

## Build

npm run build

## Preview production build

npm run preview

## Lint

npm run lint

## Chat and Contact Form

The floating assistant and Contact Us form call the FastAPI backend using the
build-time `API_BASE_URL` setting. The frontend calls `/api/v1/chat/sessions`,
`/api/v1/chat/messages`, `/api/v1/chat/lead-submissions`, and
`/api/v1/contact`; the backend mounts these routes under its configured
`API_PREFIX` (default `/api/v1`). For local development, create
`backend/.env` from `backend/.env.example`, apply migrations with
`python -m alembic upgrade head` from `backend/`, then start the backend and
frontend.

## Deploying to Vercel

Deploy the frontend and backend as separate Vercel projects:

1. The frontend's current Git repository root is `Waltain_energy/`, so select
   `./` as its Vercel Root Directory. Its existing `vercel.json` builds the
   Vite site and rewrites client-side routes to `index.html`.
2. The backend project's Root Directory must contain the backend source,
   `requirements.txt`, `vercel.json`, and `api/index.py`. Select `./` if the
   backend is its own repository, or `backend` if both projects are placed in
   one repository rooted at this workspace's parent.
3. This workspace currently has the frontend Git repository in
   `Waltain_energy/`, while `backend/` is a sibling directory outside that Git
   repository. Vercel cannot deploy that sibling from the frontend repository
   as-is. Put both directories in a shared Git repository, or publish the
   backend as its own repository before configuring its Vercel project.
4. Before the first production deploy, run
   `python -m alembic upgrade head` from `backend/` against the production
   database. Vercel's function filesystem is not a persistent database.

Set these Vercel environment variables:

| Project | Variable | Value |
| --- | --- | --- |
| Frontend | `API_BASE_URL` | `https://waltain-energy.vercel.app` (backend public URL, no trailing slash) |
| Backend | `APP_ENV` | `production` |
| Backend | `DATABASE_URL` | Production PostgreSQL connection URL; do not use SQLite |
| Backend | `ALLOWED_ORIGINS` | `https://waltainenergy-frontend.vercel.app` (exact frontend origin, no path); add any required preview origins explicitly |
| Backend | `SESSION_TOKEN_SECRET` | A unique, randomly generated secret; never use the development default |
| Backend | `SESSION_COOKIE_SECURE` | `true` |
| Backend | `SESSION_COOKIE_SAMESITE` | `none` for these separate Vercel project domains; keep `SESSION_COOKIE_SECURE=true` |

The frontend's `vite.config.js` explicitly loads `API_BASE_URL` from Vercel's
build environment and embeds only that URL into the browser bundle. After
adding or changing the variable, redeploy the frontend so the new value is
included in its build. The backend must allow the exact frontend origin above;
restart/redeploy it after changing CORS or cookie settings.

For non-FAQ chatbot replies, also set backend `LLM_PROVIDER`, `LLM_API_KEY`,
and `LLM_MODEL` to a supported provider and model. Without an LLM key, the
chatbot can still answer its built-in FAQ questions.

For contact and chatbot lead email notifications, configure
`BUSINESS_NOTIFICATION_EMAIL`, `EMAIL_FROM_ADDRESS` (a verified sender),
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_USE_TLS`,
and `SMTP_USE_SSL`. `BUSINESS_NAME`, `BUSINESS_PUBLIC_EMAIL`, and
`BUSINESS_PUBLIC_PHONE` can be set to the business's public details.
Set backend `BUSINESS_PUBLIC_EMAIL` to this comma-separated list:
`jalpan@waltainenergy.com,mailus@waltainenergy.com,connect.waltainenergy@gmail.com`.
The first two addresses are emphasized on the Contact page, footer, and emails.
Update this value in the backend's Vercel environment settings and redeploy for
the public links and chatbot replies to use the new addresses.

Anonymous website analytics records daily page views and unique browser
visitors, chatbot opens and messages, and successful contact-form submissions.
It stores only a hash of a random first-party visitor cookie, event type, and
page path; it does not store IP addresses, chat content, or form contents.
Analytics totals are not exposed through the frontend or a public reporting
API. After deploying the `traffic_events` migration, run the backend checker
from `backend/`:

```powershell
python traffic_report.py
python traffic_report.py 2026-10-23
```

The report date uses `BUSINESS_TIMEZONE` (default `Asia/Kolkata`).

Use a stable frontend domain and an API subdomain under the same site where
possible (for example `demo.example.com` and `api.example.com`), then use the
frontend origin verbatim in `ALLOWED_ORIGINS`. The app sends credentialed
requests so the backend session cookie works across the two origins. `API_BASE_URL`
is a public API address embedded at build time, not a secret; never put backend
credentials or other secrets in frontend build variables.

If using the default Vercel domains for separate projects, set
`SESSION_COOKIE_SAMESITE=none` and `SESSION_COOKIE_SECURE=true`; some browsers
restrict cross-site cookies, so custom domains on the same site are preferable.
Chat conversation history currently lives in process memory, so it is not
guaranteed to survive a backend cold start or requests handled by different
serverless instances. This is acceptable for a small demo, but reliable
multi-instance production chat needs a shared persistent session store.

The chatbot answers recognizable FAQ questions directly from the site FAQ list,
offers an FAQ panel, and displays its lead form immediately when an assistant
request fails. Chat follow-up confirmation emails include Waltain Energy's
services and public contact details.
For Groq chat responses, configure `LLM_PROVIDER=groq`, `LLM_MODEL` to a model
available to your Groq account, and `LLM_API_KEY` with the Groq API key in the
backend environment. Gemini remains available by selecting
`LLM_PROVIDER=gemini` and a Gemini model.

The contact form stores the submission before attempting SMTP delivery. Set
`BUSINESS_NOTIFICATION_EMAIL`, `EMAIL_FROM_ADDRESS`, and the `SMTP_*` settings
in the backend environment. The sender address must be verified with the email
provider. If SMTP delivery fails, the visitor is told that the inquiry was
saved but email delivery did not complete.
