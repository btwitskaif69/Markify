import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";
import { useState } from "react";

const API_URL = API_BASE_URL;

export function useBookmarkActions(authFetch, user, setAllBookmarks, collections) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (bookmarkData, editingBookmark, previewData, closeDialog) => {
    const isEditing = !!editingBookmark;
    const bookmarkId = isEditing ? editingBookmark.id : null;
    const url = isEditing
      ? `${API_URL}/bookmarks/${bookmarkId}`
      : `${API_URL}/users/${user.id}/bookmarks`;
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
    } finally {
      setIsSubmitting(false);
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
   * Syncs bookmarks by importing Chrome's exported bookmarks HTML file
   * User exports from Chrome: Bookmarks → Bookmark Manager → ⋮ → Export bookmarks
   */
  const handleSyncLocalBookmarks = async () => {
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

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to import bookmarks.");
          }

          const result = await response.json();

          if (result.createdCount === 0) {
            toast.success("All bookmarks already synced! No new bookmarks to import.");
          } else {
            toast.success(`${result.createdCount} bookmarks synced! (${result.skippedCount} duplicates skipped)`);
          }

          // Reload bookmarks to show the newly imported ones
          const reloadResponse = await authFetch(`${API_URL}/users/${user.id}/bookmarks`);
          if (reloadResponse.ok) {
            const updatedBookmarks = await reloadResponse.json();
            setAllBookmarks(updatedBookmarks);
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
  };

  /**
   * Deletes multiple bookmarks at once using the bulk delete endpoint
   */
  const handleBulkDelete = async (ids) => {
    if (!ids || ids.length === 0) return;

    // Optimistically remove from state
    let originalBookmarks;
    setAllBookmarks((prev) => {
      originalBookmarks = prev;
      return prev.filter((b) => !ids.includes(b.id));
    });

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
        setAllBookmarks(originalBookmarks);
      }
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

  return { handleSubmit, handleDelete, handleBulkDelete, handleToggleFavorite, handleMoveBookmark, handleImportBookmarks, handleSyncLocalBookmarks, isSubmitting };
}
