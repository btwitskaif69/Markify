const DEFAULT_BACKEND_URL = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://markify-api.vercel.app";

// Normalize the base URL so we don't accidentally double-prefix /api or keep trailing slashes.
const normalizeBackendUrl = (url) => {
  const raw = (url || "").trim();
  const base = raw || DEFAULT_BACKEND_URL;
  const withoutTrailingSlash = base.replace(/\/+$/, "");
  return withoutTrailingSlash.replace(/\/api$/, "");
};

export const BACKEND_BASE_URL = normalizeBackendUrl(import.meta.env.VITE_APP_BACKEND_URL);
export const API_BASE_URL = `${BACKEND_BASE_URL}/api`;

// Allow override via env, otherwise give slow endpoints a reasonable window to respond.
export const AUTH_TIMEOUT_MS = Number(import.meta.env.VITE_AUTH_TIMEOUT_MS || 12000);
