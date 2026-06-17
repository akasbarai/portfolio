import { app, initializeApp } from "../backend/src/app.js";

function normalizeApiUrl(req) {
  const url = req.url || "/";
  const [pathname, query = ""] = url.split("?");

  if (pathname.startsWith("/api") && !pathname.startsWith("/api/[")) {
    return;
  }

  const nextPath = pathname === "/" ? "" : pathname;
  req.url = `/api${nextPath}${query ? `?${query}` : ""}`;
}

export default async function handler(req, res) {
  normalizeApiUrl(req);

  await initializeApp();
  return app(req, res);
}
