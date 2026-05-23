"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { readBookmarkCache, replaceBookmarkCache } from "@/client/lib/bookmarkCache";

const API_URL = API_BASE_URL;

export function useDashboardData(user, authFetch, isAuthLoading) {
  const params = useParams();
  const router = useRouter();
  const getParamValue = (value) => (Array.isArray(value) ? value[0] : value);
  const userId = getParamValue(params?.userId);
  const activeCollectionId = getParamValue(params?.collectionId);

  const cachedSnapshot = readBookmarkCache(user?.id);
  const [allBookmarks, setAllBookmarksState] = useState(cachedSnapshot.bookmarks);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(!cachedSnapshot.hasCache);
  const [error, setError] = useState(null);
  const bookmarksRef = useRef(allBookmarks);
  const hasHydratedBookmarksRef = useRef(cachedSnapshot.hasCache);

  const setAllBookmarks = useCallback((nextBookmarks) => {
    bookmarksRef.current = nextBookmarks;
    setAllBookmarksState(nextBookmarks);
  }, []);

  useEffect(() => {
    bookmarksRef.current = allBookmarks;
  }, [allBookmarks]);

  useEffect(() => {
    const snapshot = readBookmarkCache(user?.id);
    hasHydratedBookmarksRef.current = snapshot.hasCache;
    bookmarksRef.current = snapshot.bookmarks;
    setAllBookmarks(snapshot.bookmarks);
    setCollections([]);
    setError(null);
    setIsLoading(!snapshot.hasCache);
  }, [user?.id, setAllBookmarks]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const res = await authFetch(`${API_URL}/dashboard/bootstrap`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data.");

      const data = await res.json();
      const bookmarksArray = Array.isArray(data?.bookmarks) ? data.bookmarks : null;
      const collectionsArray = Array.isArray(data?.collections) ? data.collections : null;

      if (!bookmarksArray || !collectionsArray) {
        throw new Error("Dashboard data was malformed.");
      }

      setAllBookmarks(bookmarksArray);
      setCollections(collectionsArray);
      hasHydratedBookmarksRef.current = true;
      replaceBookmarkCache(user?.id, bookmarksArray);
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
        toast.error(err.message);
      }
    }
  }, [authFetch, user?.id, setAllBookmarks]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.id !== userId) {
      return;
    }

    const shouldShowLoader = !hasHydratedBookmarksRef.current && bookmarksRef.current.length === 0;
    if (shouldShowLoader) {
      setIsLoading(true);
    }

    fetchDashboardData().finally(() => {
      setIsLoading(false);
    });
  }, [userId, user, authFetch, isAuthLoading, router, fetchDashboardData]);

  const refetchBookmarks = useCallback(async () => {
    const shouldShowLoader = !hasHydratedBookmarksRef.current && bookmarksRef.current.length === 0;
    if (shouldShowLoader) {
      setIsLoading(true);
    }

    await fetchDashboardData();
    setIsLoading(false);
  }, [fetchDashboardData]);

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
