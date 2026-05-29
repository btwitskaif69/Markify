"use client";

const DASHBOARD_BOOTSTRAP_CACHE_VERSION = "v1";
const DASHBOARD_BOOTSTRAP_CACHE_TTL_MS = 10 * 60 * 1000;

const getDashboardBootstrapCacheKey = (userId) =>
  userId ? `dashboard_bootstrap_${DASHBOARD_BOOTSTRAP_CACHE_VERSION}_${userId}` : null;

const createEmptySnapshot = () => ({
  hasCache: false,
  version: DASHBOARD_BOOTSTRAP_CACHE_VERSION,
  cachedAt: 0,
  bookmarks: [],
  collections: [],
  isStale: false,
  key: null,
});

export const readDashboardBootstrapCache = (userId) => {
  const key = getDashboardBootstrapCacheKey(userId);
  if (!key || typeof window === "undefined") {
    return createEmptySnapshot();
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return { ...createEmptySnapshot(), key };
    }

    const parsed = JSON.parse(raw);
    const isValid =
      parsed &&
      typeof parsed === "object" &&
      parsed.version === DASHBOARD_BOOTSTRAP_CACHE_VERSION &&
      typeof parsed.cachedAt === "number" &&
      Array.isArray(parsed.bookmarks) &&
      Array.isArray(parsed.collections);

    if (!isValid) {
      localStorage.removeItem(key);
      return { ...createEmptySnapshot(), key };
    }

    return {
      key,
      hasCache: true,
      version: parsed.version,
      cachedAt: parsed.cachedAt,
      bookmarks: parsed.bookmarks,
      collections: parsed.collections,
      isStale: Date.now() - parsed.cachedAt > DASHBOARD_BOOTSTRAP_CACHE_TTL_MS,
    };
  } catch {
    localStorage.removeItem(key);
    return { ...createEmptySnapshot(), key };
  }
};

export const replaceDashboardBootstrapCache = (userId, { bookmarks, collections }) => {
  const key = getDashboardBootstrapCacheKey(userId);
  if (!key || typeof window === "undefined") {
    return false;
  }

  localStorage.setItem(
    key,
    JSON.stringify({
      version: DASHBOARD_BOOTSTRAP_CACHE_VERSION,
      cachedAt: Date.now(),
      bookmarks: Array.isArray(bookmarks) ? bookmarks : [],
      collections: Array.isArray(collections) ? collections : [],
    })
  );

  return true;
};

export const clearDashboardBootstrapCache = (userId) => {
  const key = getDashboardBootstrapCacheKey(userId);
  if (!key || typeof window === "undefined") {
    return false;
  }

  localStorage.removeItem(key);
  return true;
};

export { DASHBOARD_BOOTSTRAP_CACHE_TTL_MS };
