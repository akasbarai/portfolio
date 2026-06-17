# Flexible MERN Portfolio CMS

This project is a split MERN portfolio with a full visual CMS:

- `frontend/` - React + Vite portfolio and CMS dashboard
- `backend/` - Express + MongoDB API for content, auth, and contact messages

## Quick Start

```bash
npm run install:all
npm run dev
```

Frontend: `http://localhost:5173`

CMS: `http://localhost:5173/DonChandu`

Backend API: `http://localhost:5000/api`

The frontend calls `/api` by default. In development, Vite proxies that to the backend, so the CMS works from `localhost` and local network URLs. Set `VITE_API_URL` only if your API is hosted on a separate domain.

## CMS Features

- Edit portfolio text, images, links, colors, navigation, projects, skills, services, testimonials, and contact details.
- Image fields accept either a URL or a local image chosen from your computer.
- Add, duplicate, reorder, and delete list items from visual controls.
- Add custom fields to any object or list item.
- Use `customSections` to create new visible portfolio sections without changing code.
- Use Raw JSON mode when you need complete low-level control.
- Read, archive, and delete contact messages from the dashboard.

## Data Storage

MongoDB is optional for local use.

- With `MONGO_URI`, content, admins, and messages are stored in MongoDB.
- Without `MONGO_URI`, the backend now stores CMS data in files:
  - `backend/storage/content.json`
  - `backend/storage/messages.json`

This means CMS edits survive server restarts even when MongoDB is not configured.

## Default CMS Login

For local development, the fallback login is:

```bash
admin@example.com
change-me-now
```

Before deploying, copy `backend/.env.example` to `backend/.env` and set strong values:

```bash
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-real-password
JWT_SECRET=replace-with-a-long-secret
MONGO_URI=mongodb://127.0.0.1:27017/advanced_portfolio
```

When MongoDB is connected, the backend creates the first admin automatically. In production, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` must be configured.

## Build

```bash
npm run build
```

## Production Deployment

This repo is configured for a split deployment:

- Vercel builds and serves the React/Vite frontend from `frontend/dist`.
- Render runs the Express backend from `backend/`.
- Vercel proxies `/api/*` requests to the Render backend, so the frontend can keep using `/api`.

The planned Render backend URL is:

```bash
https://akasbarai-portfolio-backend.onrender.com
```

Create the backend on Render from `render.yaml`. During the Blueprint setup, enter these secret environment variables:

```bash
MONGO_URI=your-mongodb-atlas-uri
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=use-a-real-password
```

`JWT_SECRET` is generated automatically by Render from `render.yaml`.

If you later use a custom frontend domain outside `*.vercel.app`, add it to Render as:

```bash
CLIENT_URL=https://your-custom-domain.com
```

MongoDB is strongly recommended for the deployed CMS. Without `MONGO_URI`, Render's filesystem fallback is not reliable for persistent CMS edits.

For Vercel, use the root repo with the included `vercel.json`:

```bash
Install Command: npm ci --prefix frontend
Build Command: npm run build --prefix frontend
Output Directory: frontend/dist
```

The working app lives in `frontend/` and is served through Vite. The old root `index.html` static portfolio file has been removed.
