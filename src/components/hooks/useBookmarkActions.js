// src/components/Dashboard/useBookmarkActions.js
import { toast } from "sonner";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;

export function useBookmarkActions(authFetch, user, setBookmarks, setAllBookmarks, collections) {
  const handleSubmit = async (bookmarkData, editingBookmark, previewData, closeDialog) => {
    const isEditing = !!editingBookmark;
    const bookmarkId = isEditing ? editingBookmark.id : null;
    const url = isEditing
      ? `${API_URL}/bookmarks/${bookmarkId}`
      : `${API_URL}/users/${user.id}/bookmarks`;
    const method = isEditing ? "PATCH" : "POST";
    const dataToSubmit = { ...bookmarkData, previewImage: previewData?.image || null };

    try {
      const response = await authFetch(url, { method, body: JSON.stringify(dataToSubmit) });
      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      if (!response.ok) throw new Error(`Failed to submit bookmark.`);
      const { bookmark: returnedBookmark } = await response.json();

      setBookmarks((prev) =>
        isEditing ? prev.map((b) => (b.id === returnedBookmark.id ? returnedBookmark : b)) : [returnedBookmark, ...prev]
      );

      toast.success(isEditing ? "Bookmark updated!" : "Bookmark added!");
      closeDialog();
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error(err.message);
      }
    }
  };

  const handleDelete = async (id) => {
    const originalBookmarks = [];
    setBookmarks((prev) => {
      originalBookmarks.push(...prev);
      return prev.filter((b) => b.id !== id);
    });
    toast.success("Bookmark deleted.");
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete on the server.");
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Failed to delete. Restoring bookmark.");
        setBookmarks(originalBookmarks);
      }
    }
  };

  const handleToggleFavorite = async (id, currentIsFavorite) => {
    const originalBookmarks = [];
    setBookmarks((prev) => {
      originalBookmarks.push(...prev);
      return prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
    });
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update favorite status.");
      const { bookmark: returnedBookmark } = await response.json();
      setBookmarks((prev) => prev.map((b) => (b.id === id ? returnedBookmark : b)));
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Could not update favorite status.");
        setBookmarks(originalBookmarks);
      }
    }
  };

  const handleMoveBookmark = async (bookmarkId, collectionId) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${bookmarkId}`, {
        method: "PATCH",
        body: JSON.stringify({ collectionId }),
      });

      if (!response.ok) throw new Error("Failed to move bookmark.");
      const { bookmark: returnedBookmark } = await response.json();

      setAllBookmarks((prev) => prev.map((b) => (b.id === returnedBookmark.id ? returnedBookmark : b)));

      let toastMessage = "Bookmark moved successfully!";
      if (collectionId) {
        const collection = collections.find((c) => c.id === collectionId);
        if (collection) {
          toastMessage = `Bookmark moved to "${collection.name}"!`;
        }
      } else {
        toastMessage = "Bookmark removed from collection.";
      }

      toast.success(toastMessage);
    } catch {
      toast.error("Failed to move bookmark.");
    }
  };

  return { handleSubmit, handleDelete, handleToggleFavorite, handleMoveBookmark };
}
