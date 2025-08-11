// src/components/Dashboard/useDashboardData.js
import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;
const PAGE_SIZE = 8;

export function useDashboardData(user, authFetch, isAuthLoading) {
  const { userId, collectionId: activeCollectionId } = useParams();
  const navigate = useNavigate();

  const [allBookmarks, setAllBookmarks] = useState([]);
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
          `${API_URL}/users/${userId}/bookmarks?limit=${PAGE_SIZE}&offset=${
            pageNumber * PAGE_SIZE
          }`
        );
        if (!res.ok) throw new Error("Failed to fetch bookmarks.");
        const data = await res.json();

        if (pageNumber === 0) {
          // First load
          setAllBookmarks(data);
        } else {
          // Append more
          setAllBookmarks((prev) => [...prev, ...data]);
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
    [authFetch, userId]
  );

  // Load collections once
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }
    if (user.id !== userId) return;

    setIsLoading(true);

    // Initial bookmarks fetch
    fetchBookmarks(0).finally(() => setIsLoading(false));

    // Fetch collections in parallel
    authFetch(`${API_URL}/collections`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setCollections)
      .catch((err) => {
        if (err.message !== "Session expired") {
          toast.error(err.message);
        }
      });
  }, [userId, user, authFetch, isAuthLoading, navigate, fetchBookmarks]);

  // Load more bookmarks
  const fetchMoreBookmarks = async () => {
    if (!hasMore || isFetchingMore) return;
    setIsFetchingMore(true);
    const nextPage = page + 1;
    await fetchBookmarks(nextPage);
    setPage(nextPage);
    setIsFetchingMore(false);
  };

  // Filter bookmarks by active collection
  const bookmarks = useMemo(() => {
    if (!activeCollectionId) return allBookmarks;
    return allBookmarks.filter((bm) => bm.collectionId === activeCollectionId);
  }, [activeCollectionId, allBookmarks]);

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
    isFetchingMore,
  };
}
