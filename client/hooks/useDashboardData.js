"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/client/lib/apiConfig";

const API_URL = API_BASE_URL;
const BOOKMARKS_CACHE_VERSION = "v2";

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

  const fetchBookmarks = useCallback(async () => {
    try {
      setError(null);
      const res = await authFetch(`${API_URL}/users/${userId}/bookmarks`);
      if (!res.ok) throw new Error("Failed to fetch bookmarks.");

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.error("Expected bookmarks to be an array, received:", data);
        setAllBookmarks([]);
        if (user?.id && typeof window !== "undefined") {
          localStorage.removeItem(getCacheKey(user.id));
        }
        return;
      }

      setAllBookmarks(data);
      if (user?.id && typeof window !== "undefined") {
        localStorage.setItem(getCacheKey(user.id), JSON.stringify(data));
      }
    } catch (err) {
      if (err.message !== "Session expired") {
        setError(err.message);
        toast.error(err.message);
      }
    }
  }, [authFetch, userId, user?.id]);

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

    fetchBookmarks().finally(() => {
      setIsLoading(false);
    });

    authFetch(`${API_URL}/collections`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        let collectionsArray = [];
        if (Array.isArray(data)) {
          collectionsArray = data;
        } else if (data && Array.isArray(data.collections)) {
          collectionsArray = data.collections;
        } else if (data && Array.isArray(data.data)) {
          collectionsArray = data.data;
        } else {
          console.error(
            "Expected collections to be an array (or in `collections`/`data`), received:",
            data
          );
        }

        setCollections(collectionsArray);
      })
      .catch((err) => {
        if (err.message !== "Session expired") {
          toast.error(err.message);
        }
      });
  }, [userId, user, authFetch, isAuthLoading, router, fetchBookmarks]);

  const refetchBookmarks = useCallback(async () => {
    const shouldShowLoader = bookmarksRef.current.length === 0;
    if (shouldShowLoader) {
      setIsLoading(true);
    }

    await fetchBookmarks();
    setIsLoading(false);
  }, [fetchBookmarks]);

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
