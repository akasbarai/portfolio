import { app, initializeApp } from "../backend/src/app.js";

function normalizeApiUrl(req) {
  const url = req.url || "/";
  const [pathname, query = ""] = url.split("?");

  if (pathname.startsWith("/api") && !pathname.startsWith("/api/[")) {
    return;
  }

  const rawPath = req.query?.path;
  const segments = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : [];
  const normalizedPath = segments
    .map((segment) => String(segment).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  const fallbackPath = pathname === "/" || pathname.startsWith("/api/[") ? "" : pathname;
  const nextPath = normalizedPath ? `/${normalizedPath}` : fallbackPath;

  req.url = `/api${nextPath}${query ? `?${query}` : ""}`;
}

export default async function handler(req, res) {
  normalizeApiUrl(req);

  await initializeApp();
  return app(req, res);
}
