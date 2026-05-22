"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/client/lib/apiConfig";

const API_URL = API_BASE_URL;
const BOOKMARKS_CACHE_VERSION = "v3";

const getCacheKey = (userId) =>
  userId ? `bookmarks_cache_${BOOKMARKS_CACHE_VERSION}_${userId}` : null;

const readCachedBookmarks = (userId) => {
  if (typeof window === "undefined" || !userId) {
    return [];
  }

  try {
    const cached = localStorage.getItem(getCacheKey(userId));
    return cached ? JSON.parse(cached) : [];
  } catch (error) {
    console.error("Failed to parse bookmark cache", error);
    return [];
  }
};

export function useDashboardData(user, authFetch, isAuthLoading) {
  const params = useParams();
  const router = useRouter();
  const getParamValue = (value) => (Array.isArray(value) ? value[0] : value);
  const userId = getParamValue(params?.userId);
  const activeCollectionId = getParamValue(params?.collectionId);

  const cachedBookmarks = readCachedBookmarks(user?.id);
  const [allBookmarks, setAllBookmarks] = useState(cachedBookmarks);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(cachedBookmarks.length === 0);
  const [error, setError] = useState(null);
  const bookmarksRef = useRef(allBookmarks);

  useEffect(() => {
    bookmarksRef.current = allBookmarks;
  }, [allBookmarks]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setError(null);
      const res = await authFetch(`${API_URL}/dashboard/bootstrap`);
      if (!res.ok) throw new Error("Failed to fetch dashboard data.");

      const data = await res.json();
      const bookmarksArray = Array.isArray(data?.bookmarks) ? data.bookmarks : null;
      const collectionsArray = Array.isArray(data?.collections) ? data.collections : null;

      if (!bookmarksArray || !collectionsArray) {
        console.error("Expected dashboard bootstrap data, received:", data);
        setAllBookmarks([]);
        setCollections([]);
        if (user?.id && typeof window !== "undefined") {
          localStorage.removeItem(getCacheKey(user.id));
        }
        return;
      }

      setAllBookmarks(bookmarksArray);
      setCollections(collectionsArray);
      if (user?.id && typeof window !== "undefined") {
        localStorage.setItem(getCacheKey(user.id), JSON.stringify(bookmarksArray));
      }
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
        toast.error(err.message);
      }
    }
  }, [authFetch, user?.id]);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.id !== userId) {
      return;
    }

    const shouldShowLoader = bookmarksRef.current.length === 0;
    if (shouldShowLoader) {
      setIsLoading(true);
    }

    fetchDashboardData().finally(() => {
      setIsLoading(false);
    });
  }, [userId, user, authFetch, isAuthLoading, router, fetchDashboardData]);

  const refetchBookmarks = useCallback(async () => {
    const shouldShowLoader = bookmarksRef.current.length === 0;
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
  };
}
