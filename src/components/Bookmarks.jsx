import { useState } from "react";
import BookmarkCard from "@/components/Bookmarks/BookmarkCard";
import BookmarkListItem from "@/components/Bookmarks/BookmarkListItem";
import BookmarkFilters from "@/components/Bookmarks/BookmarkFilters";
import BookmarkStats from "@/components/Bookmarks/BookmarkStats";
import { Card } from "@/components/ui/card";

export default function Bookmarks({ bookmarks, isLoading, error, onEdit, onDelete, onToggleFavorite }) {
  // --- LOCAL UI STATE & FILTERING ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

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

  // --- RENDER LOGIC ---
if (isLoading) return <div className="flex justify-center items-center h-screen">Loading bookmarks...</div>;
  if (error) return <div className="container mx-auto p-6 text-center text-red-500">Error: {error}</div>;

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
      />

      <BookmarkStats bookmarks={bookmarks} />

      {filteredBookmarks.length === 0 ? (
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
                onEdit={onEdit} // Pass down the handler from props
                onDelete={onDelete} // Pass down the handler from props
                onToggleFavorite={onToggleFavorite} // Pass down the handler from props
              />
            ) : (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit} // Also for the list item
                onDelete={onDelete}
              />
            )
          )}
        </div>
      )}
    </main>
  );
}