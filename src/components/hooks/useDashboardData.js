// src/components/Dashboard/useDashboardData.js
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;

export function useDashboardData(user, authFetch, isAuthLoading) {
  const { userId, collectionId: activeCollectionId } = useParams();
  const navigate = useNavigate();

  const [allBookmarks, setAllBookmarks] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data
  useEffect(() => {
    if (isAuthLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.id === userId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const [bookmarksRes, collectionsRes] = await Promise.all([
            authFetch(`${API_URL}/users/${userId}/bookmarks`),
            authFetch(`${API_URL}/collections`),
          ]);

          if (!bookmarksRes.ok || !collectionsRes.ok) throw new Error("Failed to fetch data.");

          const bookmarksData = await bookmarksRes.json();
          const collectionsData = await collectionsRes.json();

          setAllBookmarks(bookmarksData);
          setCollections(collectionsData);
        } catch (err) {
          if (err.message !== "Session expired") {
            setError(err.message);
            toast.error(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [userId, user, authFetch, isAuthLoading, navigate]);

  // Filter bookmarks by collection
  useEffect(() => {
    if (activeCollectionId) {
      const filtered = allBookmarks.filter((bm) => bm.collectionId === activeCollectionId);
      setBookmarks(filtered);
    } else {
      setBookmarks(allBookmarks);
    }
  }, [activeCollectionId, allBookmarks]);

  return {
    allBookmarks,
    bookmarks,
    setBookmarks,
    collections,
    setCollections,
    isLoading,
    error,
    setAllBookmarks,
  };
}
