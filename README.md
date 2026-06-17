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

CMS: `http://localhost:5173/admin`

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

The root `index.html` is the original static source. The working CMS-powered app lives in `frontend/` and is served through Vite.
