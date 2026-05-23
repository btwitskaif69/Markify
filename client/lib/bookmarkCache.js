const BOOKMARK_CACHE_VERSION = "v3";
const BOOKMARK_CACHE_TTL_MS = 10 * 60 * 1000;

const getBookmarkCacheKey = (userId) =>
  userId ? `bookmarks_cache_${BOOKMARK_CACHE_VERSION}_${userId}` : null;

const createEmptySnapshot = () => ({
  hasCache: false,
  version: BOOKMARK_CACHE_VERSION,
  cachedAt: 0,
  bookmarks: [],
  isStale: false,
  key: null,
});

export const readBookmarkCache = (userId) => {
  const key = getBookmarkCacheKey(userId);
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
      parsed.version === BOOKMARK_CACHE_VERSION &&
      typeof parsed.cachedAt === "number" &&
      Array.isArray(parsed.bookmarks);

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
      isStale: Date.now() - parsed.cachedAt > BOOKMARK_CACHE_TTL_MS,
    };
  } catch {
    localStorage.removeItem(key);
    return { ...createEmptySnapshot(), key };
  }
};

export const replaceBookmarkCache = (userId, bookmarks) => {
  const key = getBookmarkCacheKey(userId);
  if (!key || typeof window === "undefined") {
    return false;
  }

  localStorage.setItem(
    key,
    JSON.stringify({
      version: BOOKMARK_CACHE_VERSION,
      cachedAt: Date.now(),
      bookmarks: Array.isArray(bookmarks) ? bookmarks : [],
    })
  );

  return true;
};

export const clearBookmarkCache = (userId) => {
  const key = getBookmarkCacheKey(userId);
  if (!key || typeof window === "undefined") {
    return false;
  }

  localStorage.removeItem(key);
  return true;
};
