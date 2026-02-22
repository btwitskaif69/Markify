"use client";

// src/components/Dashboard/useDashboardData.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/client/lib/apiConfig";

const API_URL = API_BASE_URL;
const PAGE_SIZE = 8;

export function useDashboardData(user, authFetch, isAuthLoading) {
  const params = useParams();
  const router = useRouter();
  const getParamValue = (value) => (Array.isArray(value) ? value[0] : value);
  const userId = getParamValue(params?.userId);
  const activeCollectionId = getParamValue(params?.collectionId);

  const [allBookmarks, setAllBookmarks] = useState(() => {
    // Try to load from cache
    if (typeof window !== "undefined" && user?.id) {
      const cached = localStorage.getItem(`bookmarks_cache_${user.id}`);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error("Failed to parse bookmark cache", e);
        }
      }
    }
    return [];
  });
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Fetch bookmarks (paginated)
  const fetchBookmarks = useCallback(
    async (pageNumber = 0) => {
      try {
        const res = await authFetch(
          `${API_URL}/users/${userId}/bookmarks?limit=${PAGE_SIZE}&offset=${pageNumber * PAGE_SIZE
          }`
        );
        if (!res.ok) throw new Error("Failed to fetch bookmarks.");
        const data = await res.json();

        if (pageNumber === 0) {
          // First load
          if (Array.isArray(data)) {
            setAllBookmarks(data);
            // Update cache
            if (user?.id) {
              localStorage.setItem(`bookmarks_cache_${user.id}`, JSON.stringify(data));
            }
          } else {
            console.error("Expected bookmarks to be an array, received:", data);
            setAllBookmarks([]);
          }
        } else {
          // Append more
          if (Array.isArray(data)) {
            setAllBookmarks((prev) => [...prev, ...data]);
          }
        }

        // If fewer than PAGE_SIZE items returned → no more pages
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        if (err.message !== "Session expired") {
          setError(err.message);
          toast.error(err.message);
        }
      }
    },
    [authFetch, userId, user?.id]
  );

  // Load collections once
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.id !== userId) {
      return;
    }
    setIsLoading(true);

    // Initial bookmarks fetch
    fetchBookmarks(0).finally(() => setIsLoading(false));

    // Fetch collections in parallel
    authFetch(`${API_URL}/collections`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        // Support both array responses and wrapped object responses
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

  // Load more bookmarks
  const fetchMoreBookmarks = async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    await fetchBookmarks(nextPage);
    setPage(nextPage);
    setIsFetchingMore(false);
  };

  // Refetch first page (used after import/sync actions)
  const refetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setPage(0);
    setHasMore(true);
    await fetchBookmarks(0);
    setIsLoading(false);
  }, [fetchBookmarks]);

  // Filter bookmarks by active collection
  const bookmarks = useMemo(() => {
    if (!activeCollectionId) return allBookmarks;
    return allBookmarks.filter((bm) => bm.collectionId === activeCollectionId);
  }, [activeCollectionId, allBookmarks]);

  // Get active collection object
  const activeCollection = useMemo(() => {
    if (!activeCollectionId) return null;
    return collections.find((c) => c.id === activeCollectionId) || null;
  }, [activeCollectionId, collections]);

  return {
    allBookmarks,
    bookmarks,
    setAllBookmarks,
    collections,
    setCollections,
    isLoading,
    error,
    hasMore,
    fetchMoreBookmarks,
    refetchBookmarks,
    isFetchingMore,
    activeCollectionId,
    activeCollection,
  };
}
