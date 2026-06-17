function resolveApiUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();
  if (!configuredUrl) return "/api";

  const withoutTrailingSlash = configuredUrl.replace(/\/+$/, "");

  if (import.meta.env.PROD) {
    try {
      const url = new URL(withoutTrailingSlash);
      const localHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);

      if (localHosts.has(url.hostname)) {
        return "/api";
      }
    } catch {
      return withoutTrailingSlash || "/api";
    }
  }

  return withoutTrailingSlash || "/api";
}

const API_URL = resolveApiUrl();
const TOKEN_KEY = "portfolio_cms_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = options.token ?? getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      body:
        options.body && typeof options.body !== "string"
          ? JSON.stringify(options.body)
          : options.body
    });
  } catch {
    throw new Error("Could not reach the CMS API. Check the backend deployment and Vercel environment variables.");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}
