// pages/Bookmarks.jsx
import { useState} from "react"
import BookmarkCard from "@/components/Bookmarks/BookmarkCard"
import BookmarkListItem from "@/components/Bookmarks/BookmarkListItem"
import BookmarkFilters from "@/components/Bookmarks/BookmarkFilters"
import BookmarkStats from "@/components/Bookmarks/BookmarkStats"
import { Card } from "@/components/ui/card"

export default function Bookmarks({ bookmarks, setBookmarks, onEditBookmark }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const handleDelete = (id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))
  const toggleFavorite = (id) =>
    setBookmarks((prev) => prev.map((b) => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)))

  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch =
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || bookmark.category === selectedCategory
    const matchesFavorites = !showFavoritesOnly || bookmark.isFavorite
    return matchesSearch && matchesCategory && matchesFavorites
  })

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
          {/* Empty state */}
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
                onEdit={onEditBookmark}
                onDelete={handleDelete}
                onToggleFavorite={toggleFavorite}
              />
            ) : (
              <BookmarkListItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEditBookmark}
                onDelete={handleDelete}
              />
            )
          )}
        </div>
      )}
    </main>
  )
}
