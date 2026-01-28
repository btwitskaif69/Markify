const isDev = process.env.NODE_ENV !== "production";
const isBrowser = typeof window !== "undefined";
const DEFAULT_BACKEND_URL = isDev
  ? "http://localhost:5000"
  : "https://markify-api.vercel.app";

// Normalize the base URL so we don't accidentally double-prefix /api or keep trailing slashes.
const normalizeBackendUrl = (url) => {
  const raw = (url || "").trim();
  const base = raw || DEFAULT_BACKEND_URL;
  const withoutTrailingSlash = base.replace(/\/+$/, "");
  return withoutTrailingSlash.replace(/\/api$/, "");
};

const resolvedBackendUrl = normalizeBackendUrl(
  process.env.NEXT_PUBLIC_APP_BACKEND_URL ||
    process.env.APP_BACKEND_URL ||
    DEFAULT_BACKEND_URL
);

export const BACKEND_BASE_URL = resolvedBackendUrl;
// Use same-origin proxy in the browser to avoid CORS during dev.
export const API_BASE_URL = isBrowser ? "/api" : `${resolvedBackendUrl}/api`;

// Allow override via env, otherwise give slow endpoints a reasonable window to respond.
export const AUTH_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_AUTH_TIMEOUT_MS || 60000);
