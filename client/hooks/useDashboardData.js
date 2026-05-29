"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { readDashboardBootstrapCache, replaceDashboardBootstrapCache } from "@/client/lib/dashboardBootstrapCache";
import { replaceBookmarkCache } from "@/client/lib/bookmarkCache";

const API_URL = API_BASE_URL;
const IS_DEVELOPMENT = globalThis.process?.env?.NODE_ENV === "development";

const resolveNextValue = (nextValue, previousValue) =>
  typeof nextValue === "function" ? nextValue(previousValue) : nextValue;

const isAuthRelatedError = (message) =>
  message === "Session expired" ||
  message === "Unauthorized" ||
  message === "No token found. Please log in again.";

export function useDashboardData(user, authFetch, isAuthLoading) {
  const params = useParams();
  const getParamValue = (value) => (Array.isArray(value) ? value[0] : value);
  const routeUserId = getParamValue(params?.userId);
  const activeCollectionId = getParamValue(params?.collectionId);
  const currentUserId = user?.id || null;

  const initialSnapshot = readDashboardBootstrapCache(currentUserId);
  const [allBookmarks, setAllBookmarksState] = useState(initialSnapshot.bookmarks);
  const [collections, setCollectionsState] = useState(initialSnapshot.collections);
  const [isLoading, setIsLoading] = useState(!initialSnapshot.hasCache);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const bookmarksRef = useRef(initialSnapshot.bookmarks);
  const collectionsRef = useRef(initialSnapshot.collections);
  const inFlightRef = useRef(null);
  const authFetchRef = useRef(authFetch);

  useEffect(() => {
    authFetchRef.current = authFetch;
  }, [authFetch]);

  useEffect(() => {
    bookmarksRef.current = allBookmarks;
  }, [allBookmarks]);

  useEffect(() => {
    collectionsRef.current = collections;
  }, [collections]);

  const hydrateSnapshot = useCallback((snapshot) => {
    const safeBookmarks = Array.isArray(snapshot?.bookmarks) ? snapshot.bookmarks : [];
    const safeCollections = Array.isArray(snapshot?.collections) ? snapshot.collections : [];

    bookmarksRef.current = safeBookmarks;
    collectionsRef.current = safeCollections;
    setAllBookmarksState(safeBookmarks);
    setCollectionsState(safeCollections);
    setError(null);
  }, []);

  const syncDashboardCaches = useCallback(
    (nextBookmarks, nextCollections) => {
      if (!currentUserId) {
        return;
      }

      const safeBookmarks = Array.isArray(nextBookmarks) ? nextBookmarks : [];
      const safeCollections = Array.isArray(nextCollections) ? nextCollections : [];

      replaceBookmarkCache(currentUserId, safeBookmarks);
      replaceDashboardBootstrapCache(currentUserId, {
        bookmarks: safeBookmarks,
        collections: safeCollections,
      });
    },
    [currentUserId]
  );

  const setAllBookmarks = useCallback(
    (nextBookmarks) => {
      const resolved = resolveNextValue(nextBookmarks, bookmarksRef.current);
      const safeBookmarks = Array.isArray(resolved) ? resolved : [];
      hydrateSnapshot({
        bookmarks: safeBookmarks,
        collections: collectionsRef.current,
      });
      syncDashboardCaches(safeBookmarks, collectionsRef.current);
    },
    [hydrateSnapshot, syncDashboardCaches]
  );

  const setCollections = useCallback(
    (nextCollections) => {
      const resolved = resolveNextValue(nextCollections, collectionsRef.current);
      const safeCollections = Array.isArray(resolved) ? resolved : [];
      hydrateSnapshot({
        bookmarks: bookmarksRef.current,
        collections: safeCollections,
      });
      syncDashboardCaches(bookmarksRef.current, safeCollections);
    },
    [hydrateSnapshot, syncDashboardCaches]
  );

  const fetchDashboardData = useCallback(
    async ({ force = false } = {}) => {
      if (!currentUserId || currentUserId !== routeUserId) {
        return null;
      }

      if (inFlightRef.current) {
        return inFlightRef.current;
      }

      const cachedSnapshot = readDashboardBootstrapCache(currentUserId);
      const hasFreshCache = cachedSnapshot.hasCache && !cachedSnapshot.isStale;

      if (!force && hasFreshCache) {
        if (IS_DEVELOPMENT) {
          console.debug("[dashboard/bootstrap] cache hit", {
            userId: currentUserId,
            routeUserId,
            cachedAt: cachedSnapshot.cachedAt,
          });
        }

        hydrateSnapshot(cachedSnapshot);
        setIsLoading(false);
        setIsRefreshing(false);
        return cachedSnapshot;
      }

      const request = (async () => {
        if (cachedSnapshot.hasCache) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setError(null);

        if (IS_DEVELOPMENT) {
          console.debug("[dashboard/bootstrap] requesting", {
            userId: currentUserId,
            routeUserId,
            force,
            cachedAt: cachedSnapshot.cachedAt,
            hasCache: cachedSnapshot.hasCache,
            stale: cachedSnapshot.isStale,
          });
        }

        try {
          const res = await authFetchRef.current(`${API_URL}/dashboard/bootstrap`, {
            cache: "no-store",
          });

          if (!res.ok) {
            throw new Error("Failed to fetch dashboard data.");
          }

          const data = await res.json();
          const bookmarksArray = Array.isArray(data?.bookmarks) ? data.bookmarks : null;
          const collectionsArray = Array.isArray(data?.collections) ? data.collections : null;

          if (!bookmarksArray || !collectionsArray) {
            throw new Error("Dashboard data was malformed.");
          }

          hydrateSnapshot({
            bookmarks: bookmarksArray,
            collections: collectionsArray,
          });
          syncDashboardCaches(bookmarksArray, collectionsArray);

          return data;
        } catch (err) {
          const message = err?.message || "Failed to load dashboard data.";
          if (!isAuthRelatedError(message)) {
            setError(message);
            toast.error(message);
          }
          return null;
        } finally {
          setIsLoading(false);
          setIsRefreshing(false);
          inFlightRef.current = null;
        }
      })();

      inFlightRef.current = request;
      return request;
    },
    [currentUserId, hydrateSnapshot, routeUserId, syncDashboardCaches]
  );

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!currentUserId) {
      bookmarksRef.current = [];
      collectionsRef.current = [];
      setAllBookmarksState([]);
      setCollectionsState([]);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (currentUserId !== routeUserId) {
      return;
    }

    const snapshot = readDashboardBootstrapCache(currentUserId);
    if (snapshot.hasCache) {
      hydrateSnapshot(snapshot);
      setIsLoading(false);
      setIsRefreshing(false);
    } else {
      setIsLoading(true);
    }

    if (!snapshot.hasCache || snapshot.isStale) {
      void fetchDashboardData();
    }
  }, [currentUserId, fetchDashboardData, hydrateSnapshot, isAuthLoading, routeUserId]);

  const refetchBookmarks = useCallback(
    async ({ force = false } = {}) => {
      return fetchDashboardData({ force });
    },
    [fetchDashboardData]
  );

  const bookmarks = useMemo(() => {
    if (!activeCollectionId) return allBookmarks;
    return allBookmarks.filter((bookmark) => bookmark.collectionId === activeCollectionId);
  }, [activeCollectionId, allBookmarks]);

  const activeCollection = useMemo(() => {
    if (!activeCollectionId) return null;
    return collections.find((collection) => collection.id === activeCollectionId) || null;
  }, [activeCollectionId, collections]);

  const getBookmarksSnapshot = useCallback(() => bookmarksRef.current, []);

  return {
    allBookmarks,
    bookmarks,
    setAllBookmarks,
    collections,
    setCollections,
    isLoading,
    isRefreshing,
    error,
    hasMore: false,
    fetchMoreBookmarks: async () => {},
    refetchBookmarks,
    isFetchingMore: false,
    activeCollectionId,
    activeCollection,
    getBookmarksSnapshot,
  };
}
