const developmentJwtSecret = "dev-secret-change-me";
let warnedAboutJwtSecret = false;

export function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;

  if (process.env.NODE_ENV === "production") {
    const error = new Error("JWT_SECRET must be configured in production.");
    error.status = 500;
    throw error;
  }

  if (!warnedAboutJwtSecret) {
    console.warn("JWT_SECRET is not set. Using a development-only fallback secret.");
    warnedAboutJwtSecret = true;
  }

  return developmentJwtSecret;
}

export function getFallbackAdminCredentials() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "change-me-now";

  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)
  ) {
    const error = new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured in production.");
    error.status = 503;
    throw error;
  }

  return { email, password };
}
