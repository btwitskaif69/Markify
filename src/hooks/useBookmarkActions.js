import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

export function useBookmarkActions(authFetch, user, setAllBookmarks, collections) {
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

      setAllBookmarks((prev) =>
        isEditing
          ? prev.map((b) => (b.id === returnedBookmark.id ? returnedBookmark : b))
          : [returnedBookmark, ...prev]
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
    let originalBookmarks;
    setAllBookmarks((prev) => {
      originalBookmarks = prev;
      return prev.filter((b) => b.id !== id);
    });
    toast.success("Bookmark deleted.");
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete on the server.");
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Failed to delete. Restoring bookmark.");
        setAllBookmarks(originalBookmarks);
      }
    }
  };

  const handleToggleFavorite = async (id, currentIsFavorite) => {
    let originalBookmarks;
    setAllBookmarks((prev) => {
      originalBookmarks = prev;
      return prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
    });
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update favorite status.");
      const { bookmark: returnedBookmark } = await response.json();
      setAllBookmarks((prev) => prev.map((b) => (b.id === id ? returnedBookmark : b)));
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Could not update favorite status.");
        setAllBookmarks(originalBookmarks);
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

  const handleImportBookmarks = async (bookmarks) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/import`, {
        method: "POST",
        body: JSON.stringify(bookmarks),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to import bookmarks.");
      }

      const result = await response.json();
      toast.success(`${result.message} (${result.createdCount} imported, ${result.skippedCount} skipped)`);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  /**
   * Fetches preview for a single bookmark and updates the state
   */
  const fetchSinglePreview = async (bookmarkId) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${bookmarkId}/fetch-preview`, {
        method: "POST",
      });

      if (!response.ok) return false;

      const result = await response.json();
      if (result.success && result.bookmark) {
        // Update the bookmark in state with the new preview
        setAllBookmarks((prev) =>
          prev.map((b) => (b.id === result.bookmark.id ? result.bookmark : b))
        );
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  /**
   * Syncs bookmarks from browser, then fetches previews one by one in the background
   */
  const handleSyncLocalBookmarks = async () => {
    try {
      // Step 1: Sync bookmarks quickly (without previews)
      const response = await authFetch(`${API_URL}/bookmarks/sync-local`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to sync bookmarks.");
      }

      const result = await response.json();

      if (result.createdCount === 0) {
        toast.success(`${result.message} (No new bookmarks to import)`);
        return true;
      }

      toast.success(`${result.createdCount} bookmarks imported from ${result.source}. Fetching previews...`);

      // Step 2: Reload bookmarks to get the newly created ones
      const reloadResponse = await authFetch(`${API_URL}/users/${user.id}/bookmarks`);
      if (reloadResponse.ok) {
        const bookmarks = await reloadResponse.json();
        setAllBookmarks(bookmarks);
      }

      // Step 3: Fetch previews one by one in the background (non-blocking)
      if (result.createdIds && result.createdIds.length > 0) {
        // Start fetching previews without blocking
        fetchPreviewsInBackground(result.createdIds);
      }

      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  /**
   * Fetches previews for a list of bookmark IDs one at a time
   * This runs in the background and updates bookmarks as previews are fetched
   */
  const fetchPreviewsInBackground = async (bookmarkIds) => {
    let successCount = 0;
    const total = bookmarkIds.length;

    for (let i = 0; i < bookmarkIds.length; i++) {
      const bookmarkId = bookmarkIds[i];
      const success = await fetchSinglePreview(bookmarkId);
      if (success) successCount++;

      // Show progress every 5 bookmarks or at the end
      if ((i + 1) % 5 === 0 || i === bookmarkIds.length - 1) {
        console.log(`Preview progress: ${i + 1}/${total} processed, ${successCount} successful`);
      }
    }

    // Show final result
    if (successCount > 0) {
      toast.success(`Loaded ${successCount} preview images`);
    }
  };

  return { handleSubmit, handleDelete, handleToggleFavorite, handleMoveBookmark, handleImportBookmarks, handleSyncLocalBookmarks };
}
