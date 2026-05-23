import { toast } from "sonner";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { FREE_BOOKMARK_LIMIT, hasActiveProAccess } from "@/lib/subscription";
import { buildBookmarkImportToastMessage } from "@/lib/bookmarkImport";
import { clearBookmarkCache, replaceBookmarkCache } from "@/client/lib/bookmarkCache";
import { useState, useCallback } from "react";

const API_URL = API_BASE_URL;

export function useBookmarkActions(
  authFetch,
  user,
  setAllBookmarks,
  collections,
  { bookmarkCount = 0, getBookmarksSnapshot } = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = user?.id;
  const getLatestBookmarks = useCallback(() => {
    const snapshot = typeof getBookmarksSnapshot === "function" ? getBookmarksSnapshot() : [];
    return Array.isArray(snapshot) ? snapshot : [];
  }, [getBookmarksSnapshot]);

  const syncBookmarks = useCallback(
    (nextBookmarks) => {
      setAllBookmarks(nextBookmarks);
      replaceBookmarkCache(userId, nextBookmarks);
    },
    [setAllBookmarks, userId]
  );

  const handleSubmit = useCallback(async (bookmarkData, editingBookmark, previewData, closeDialog) => {
    if (!editingBookmark && !userId) {
      toast.error("Please log in again.");
      return;
    }

    const isEditing = !!editingBookmark;
    const bookmarkId = isEditing ? editingBookmark.id : null;
    if (!isEditing && !hasActiveProAccess(user) && bookmarkCount >= FREE_BOOKMARK_LIMIT) {
      toast.error(`Free plan includes up to ${FREE_BOOKMARK_LIMIT} bookmarks. Upgrade to Pro for unlimited bookmarks.`);
      return;
    }
    const url = isEditing
      ? `${API_URL}/bookmarks/${bookmarkId}`
      : `${API_URL}/users/${userId}/bookmarks`;
    const method = isEditing ? "PATCH" : "POST";
    const dataToSubmit = { ...bookmarkData, previewImage: previewData?.image || null };

    setIsSubmitting(true);
    try {
      const response = await authFetch(url, { method, body: JSON.stringify(dataToSubmit) });
      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      if (!response.ok) throw new Error(`Failed to submit bookmark.`);
      const { bookmark: returnedBookmark } = await response.json();

      const currentBookmarks = getLatestBookmarks();
      const nextBookmarks = isEditing
        ? currentBookmarks.map((b) => (b.id === returnedBookmark.id ? returnedBookmark : b))
        : [returnedBookmark, ...currentBookmarks];
      syncBookmarks(nextBookmarks);

      toast.success(isEditing ? "Bookmark updated!" : "Bookmark added!");
      closeDialog();
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [authFetch, userId, bookmarkCount, user, getLatestBookmarks, syncBookmarks]);

  const handleDelete = useCallback(async (id) => {
    const originalBookmarks = getLatestBookmarks();
    const nextBookmarks = originalBookmarks.filter((b) => b.id !== id);
    syncBookmarks(nextBookmarks);
    toast.success("Bookmark deleted.");
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete on the server.");
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Failed to delete. Restoring bookmark.");
        syncBookmarks(originalBookmarks);
      }
    }
  }, [authFetch, getLatestBookmarks, syncBookmarks]);

  const handleToggleFavorite = useCallback(async (id, currentIsFavorite) => {
    const originalBookmarks = getLatestBookmarks();
    const optimisticBookmarks = originalBookmarks.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b));
    syncBookmarks(optimisticBookmarks);
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update favorite status.");
      const { bookmark: returnedBookmark } = await response.json();
      const latestBookmarks = getLatestBookmarks();
      const nextBookmarks = latestBookmarks.map((b) => (b.id === id ? returnedBookmark : b));
      syncBookmarks(nextBookmarks);
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Could not update favorite status.");
        syncBookmarks(originalBookmarks);
      }
    }
  }, [authFetch, getLatestBookmarks, syncBookmarks]);

  const handleMoveBookmark = useCallback(async (bookmarkId, collectionId) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${bookmarkId}`, {
        method: "PATCH",
        body: JSON.stringify({ collectionId }),
      });

      if (!response.ok) throw new Error("Failed to move bookmark.");
      const { bookmark: returnedBookmark } = await response.json();

      const latestBookmarks = getLatestBookmarks();
      const nextBookmarks = latestBookmarks.map((b) => (b.id === returnedBookmark.id ? returnedBookmark : b));
      syncBookmarks(nextBookmarks);

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
  }, [authFetch, collections, getLatestBookmarks, syncBookmarks]);

  const handleRefreshArchive = useCallback(async (bookmarkId, { silent = false } = {}) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/${bookmarkId}/archive`, {
        method: "POST",
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to refresh saved copy.");
      }

      if (result.bookmark) {
        const latestBookmarks = getLatestBookmarks();
        const nextBookmarks = latestBookmarks.map((bookmark) =>
          bookmark.id === result.bookmark.id ? result.bookmark : bookmark
        );
        syncBookmarks(nextBookmarks);
      }

      if (!silent) {
        if (result.archive?.status === "READY") {
          toast.success("Saved copy updated.");
        } else {
          toast.error(result.archive?.failureReason || result.message || "Saved copy could not be created.");
        }
      }

      return result;
    } catch (err) {
      if (err.message !== "Session expired" && !silent) {
        toast.error(err.message || "Failed to refresh saved copy.");
      }
      throw err;
    }
  }, [authFetch, getLatestBookmarks, syncBookmarks]);

  const handleImportBookmarks = useCallback(async (bookmarks) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/import`, {
        method: "POST",
        body: JSON.stringify(bookmarks),
      });

      const result = await response.json();
      const hasImportCounts =
        typeof result?.createdCount === "number" ||
        typeof result?.duplicateCount === "number" ||
        typeof result?.limitSkippedCount === "number" ||
        typeof result?.invalidCount === "number";

      if (!response.ok) {
        throw new Error(
          hasImportCounts
            ? buildBookmarkImportToastMessage(result)
            : (result.message || "Failed to import bookmarks.")
        );
      }

      const message = buildBookmarkImportToastMessage(result);
      if ((result.createdCount || 0) > 0) {
        toast.success(message);
      } else {
        toast.info(message);
      }
      clearBookmarkCache(userId);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }, [authFetch, userId]);

  /**
   * Syncs bookmarks by importing Chrome's exported bookmarks HTML file
   * User exports from Chrome: Bookmarks → Bookmark Manager → ⋮ → Export bookmarks
   */
  const handleSyncLocalBookmarks = useCallback(async () => {
    return new Promise((resolve) => {
      // Create a file input to let user select the bookmarks HTML file
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.html';

      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          resolve(false);
          return;
        }

        try {
          const htmlContent = await file.text();

          // Parse the HTML to extract bookmarks
          const parser = new DOMParser();
          const doc = parser.parseFromString(htmlContent, 'text/html');
          const bookmarks = [];

          // Chrome exports bookmarks as <A> tags with HREF attribute
          const links = doc.querySelectorAll('a[href]');

          links.forEach((link) => {
            const url = link.getAttribute('href');
            const title = link.textContent?.trim();
            const addDate = link.getAttribute('add_date');

            // Skip non-http URLs (like javascript:, chrome:, etc.)
            if (url && title && (url.startsWith('http://') || url.startsWith('https://'))) {
              bookmarks.push({
                title,
                url,
                addDate: addDate ? new Date(parseInt(addDate) * 1000).toISOString() : null,
              });
            }
          });

          if (bookmarks.length === 0) {
            toast.info("No valid bookmarks found in the file.");
            resolve(true);
            return;
          }

          // Import bookmarks via the existing import endpoint
          const response = await authFetch(`${API_URL}/bookmarks/import`, {
            method: "POST",
            body: JSON.stringify(bookmarks),
          });

          const result = await response.json();
          const hasImportCounts =
            typeof result?.createdCount === "number" ||
            typeof result?.duplicateCount === "number" ||
            typeof result?.limitSkippedCount === "number" ||
            typeof result?.invalidCount === "number";

          if (!response.ok) {
            throw new Error(
              hasImportCounts
                ? buildBookmarkImportToastMessage(result)
                : (result.message || "Failed to import bookmarks.")
            );
          }

          const message = buildBookmarkImportToastMessage(result);
          if ((result.createdCount || 0) > 0) {
            toast.success(message);
          } else {
            toast.info(message);
          }

          // Reload bookmarks to show the newly imported ones
          if (userId) {
            const reloadResponse = await authFetch(`${API_URL}/users/${userId}/bookmarks`);
            if (reloadResponse.ok) {
              const updatedBookmarks = await reloadResponse.json();
              syncBookmarks(updatedBookmarks);
            } else {
              clearBookmarkCache(userId);
            }
          } else {
            clearBookmarkCache(userId);
          }

          resolve(true);
        } catch (err) {
          toast.error(err.message || "Failed to parse bookmarks file.");
          resolve(false);
        }
      };

      // Show instructions toast
      toast.info("Select your exported Chrome bookmarks HTML file", {
        description: "Export from Chrome: Bookmarks → ⋮ → Export bookmarks"
      });

      fileInput.click();
    });
  }, [authFetch, userId, syncBookmarks]);

  /**
   * Deletes multiple bookmarks at once using the bulk delete endpoint
   */
  const handleBulkDelete = useCallback(async (ids) => {
    if (!ids || ids.length === 0) return;

    // Optimistically remove from state
    const originalBookmarks = getLatestBookmarks();
    const nextBookmarks = originalBookmarks.filter((b) => !ids.includes(b.id));
    syncBookmarks(nextBookmarks);

    try {
      const response = await authFetch(`${API_URL}/bookmarks/bulk-delete`, {
        method: "POST",
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error("Failed to delete bookmarks.");

      const result = await response.json();
      toast.success(`${result.deletedCount} bookmarks deleted.`);
    } catch (err) {
      if (err.message !== "Session expired") {
        toast.error("Failed to delete. Restoring bookmarks.");
        syncBookmarks(originalBookmarks);
      }
    }
  }, [authFetch, getLatestBookmarks, syncBookmarks]);

  return {
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    handleToggleFavorite,
    handleMoveBookmark,
    handleRefreshArchive,
    handleImportBookmarks,
    handleSyncLocalBookmarks,
    isSubmitting,
  };
}
