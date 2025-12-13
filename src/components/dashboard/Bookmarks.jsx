import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import BookmarkFilters from "../Bookmarks/BookmarkFilters";
import BookmarkStats from "../Bookmarks/BookmarkStats";
import BookmarkCard from "../Bookmarks/BookmarkCard";
import BookmarkListItem from "../Bookmarks/BookmarkListItem";
import CmdK from "./CmdK";
import BookmarkCardSkeleton from "../Bookmarks/BookmarkCardSkeleton";
import ConfirmationDialog from "./ConfirmationDialog";

export default function Bookmarks({
  bookmarks = [],
  collections = [],
  isLoading = false,
  error = null,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMove,
  onBulkDelete
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const safeBookmarks = Array.isArray(bookmarks) ? bookmarks : [];
  const filteredBookmarks = safeBookmarks.filter((bookmark) => {
    const searchString = String(bookmark.tags || '');
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchString.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  const fetchMoreBookmarks = () => {
    // Placeholder for infinite scroll if needed
  };

  // Clear selection when exiting selection mode
  useEffect(() => {
    if (!isSelectionMode) {
      setSelectedIds(new Set());
    }
  }, [isSelectionMode]);

  // Handle toggling selection of a bookmark
  const handleToggleSelect = (bookmarkId) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookmarkId)) {
        newSet.delete(bookmarkId);
      } else {
        newSet.add(bookmarkId);
      }
      return newSet;
    });
  };

  // Handle select all visible bookmarks
  const handleSelectAll = () => {
    if (selectedIds.size === filteredBookmarks.length) {
      // Deselect all
      setSelectedIds(new Set());
    } else {
      // Select all filtered bookmarks
      setSelectedIds(new Set(filteredBookmarks.map(b => b.id)));
    }
  };

  // Open confirmation dialog before deleting
  const handleDeleteSelectedClick = () => {
    if (selectedIds.size === 0) return;
    setShowDeleteConfirm(true);
  };

  // Confirm and execute bulk delete
  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    const idsToDelete = Array.from(selectedIds);

    // Call bulk delete if available, otherwise delete one by one
    if (onBulkDelete) {
      await onBulkDelete(idsToDelete);
    } else {
      for (const id of idsToDelete) {
        await onDelete(id);
      }
    }

    // Clear selection and exit selection mode
    setSelectedIds(new Set());
    setIsSelectionMode(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        fetchMoreBookmarks();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <main className="w-full px-6 py-6">
      <BookmarkFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        viewMode={viewMode}
        setViewMode={setViewMode}
        categories={["Work", "Personal", "Learning", "Entertainment", "Tools", "News", "Other"]}
        fetchMoreBookmarks={fetchMoreBookmarks}
        onOpenCmdK={() => setCmdKOpen(true)}
        // Selection mode props
        isSelectionMode={isSelectionMode}
        setIsSelectionMode={setIsSelectionMode}
        selectedCount={selectedIds.size}
        totalCount={filteredBookmarks.length}
        onSelectAll={handleSelectAll}
        onDeleteSelected={handleDeleteSelectedClick}
      />
      <CmdK
        bookmarks={bookmarks}
        open={cmdKOpen}
        setOpen={setCmdKOpen}
      />

      <BookmarkStats bookmarks={bookmarks} />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <BookmarkCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium">No bookmarks found</p>
            <p className="mt-2">Try adjusting your filters or add new bookmarks</p>
          </div>
        </Card>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-3"
          }
        >
          {filteredBookmarks.map((bookmark) =>
            viewMode === "grid" ? (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                collections={collections}
                onMove={onMove}
                // Selection mode props
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.has(bookmark.id)}
                onToggleSelect={handleToggleSelect}
              />
            ) : (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                // Selection mode props
                isSelectionMode={isSelectionMode}
                isSelected={selectedIds.has(bookmark.id)}
                onToggleSelect={handleToggleSelect}
              />
            )
          )}
        </div>
      )}

      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedIds.size} bookmark${selectedIds.size > 1 ? 's' : ''}?`}
        description="This action cannot be undone. All selected bookmarks will be permanently deleted."
      />
    </main>
  );
}
