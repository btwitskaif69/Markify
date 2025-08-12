import { useState, useEffect } from "react";
import BookmarkCard from "@/components/Bookmarks/BookmarkCard";
import BookmarkListItem from "@/components/Bookmarks/BookmarkListItem";
import BookmarkFilters from "@/components/Bookmarks/BookmarkFilters";
import BookmarkStats from "@/components/Bookmarks/BookmarkStats";
import { Card } from "@/components/ui/card";
import BookmarkCardSkeleton from "@/components/Bookmarks/BookmarkCardSkeleton";
import CmdK from "./CmdK";

export default function Bookmarks({ bookmarks, collections, isLoading, error, onEdit, onDelete, onToggleFavorite, onMove, fetchMoreBookmarks }) {
  // --- LOCAL UI STATE & FILTERING ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const searchString = String(bookmark.tags || '');
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchString.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite;
    return matchesSearch && matchesCategory && matchesFavorites;
  });

  useEffect(() => {
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      fetchMoreBookmarks();
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, [fetchMoreBookmarks]);

  // --- RENDER LOGIC ---
  // This early return for error is correct
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;

  // REMOVED the extra 'isLoading' check from here

  return (
    <main className="container mx-auto px-4 py-6">
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
        onOpenCmdK={() => setCmdKOpen(true)} // Pass handler to open CmdK
      />
      <CmdK
        bookmarks={bookmarks}
        open={cmdKOpen}
        setOpen={setCmdKOpen}
      />

      <BookmarkStats bookmarks={bookmarks} />

      {isLoading ? (
        // This part will now be reached, showing the skeletons while loading
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
              />
            ) : (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
              />
            )
          )}
        </div>
      )}
    </main>
  );
}