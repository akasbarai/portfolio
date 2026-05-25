# Personal Portfolio CMS

A React, Vite, Tailwind, and Express portfolio app with an owner-only CMS, local image uploads, server-side Gemini helpers, and an astrology consultation portal.

## Run Locally

Prerequisite: Node.js 22 or newer.

1. Install dependencies:
   `npm install`
2. Copy `.env.example` to `.env.local` and fill in:
   `OWNER_PORTAL_PASSWORD`, `SESSION_SECRET`, and optionally `GEMINI_API_KEY`.
3. Start the app:
   `npm run dev`
4. Open:
   `http://localhost:3000`

If port `3000` or `24678` is already busy, either stop the existing Node process or change `PORT` / `HMR_PORT` in `.env.local`.

## Scripts

- `npm run dev` starts the Express server with Vite middleware.
- `npm run build` builds the Vite app and bundles the server to `dist/server.cjs`.
- `npm run start` runs the production build.
- `npm run lint` runs TypeScript checks.
- `npm run clean` removes build output.

## Security Notes

- The owner portal has no hardcoded fallback password. Set `OWNER_PORTAL_PASSWORD`.
- Session tokens are signed with `SESSION_SECRET`; use a long random value.
- Astrology passwords are hashed on registration. Any older plaintext entries are migrated after a successful login.
- Uploaded files are limited to JPG, PNG, WebP, and GIF images under 8MB.

## Persistence

Portfolio and astrology records are stored in `my-portfolio/backend/portfolio-db.json` with atomic writes for local use. For a real multi-user deployment, move this data behind SQLite, PostgreSQL, Supabase, Firebase, or another managed database.
