import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import BookmarkFilters from "../Bookmarks/BookmarkFilters";
import BookmarkStats from "../Bookmarks/BookmarkStats";
import BookmarkCard from "../Bookmarks/BookmarkCard";
import BookmarkListItem from "../Bookmarks/BookmarkListItem";
import CmdK from "./CmdK";
import BookmarkCardSkeleton from "../Bookmarks/BookmarkCardSkeleton";

export default function Bookmarks({
  bookmarks = [],
  collections = [],
  isLoading = false,
  error = null,
  onEdit,
  onDelete,
  onToggleFavorite,
  onMove
}) {
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

  const fetchMoreBookmarks = () => {
    // Placeholder for infinite scroll if needed
    console.log("Fetch more bookmarks");
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
        onOpenCmdK={() => setCmdKOpen(true)}
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