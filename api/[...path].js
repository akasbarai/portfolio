import { app, initializeApp } from "../backend/src/app.js";

export default async function handler(req, res) {
  if (!req.url.startsWith("/api")) {
    req.url = `/api${req.url}`;
  }

  await initializeApp();
  return app(req, res);
}
