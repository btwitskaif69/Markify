// components/Bookmarks/BookmarkFilters.jsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Star, LayoutGrid, List } from "lucide-react"

export default function BookmarkFilters({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  showFavorites,
  setShowFavorites,
  viewMode,
  setViewMode,
  bookmarks,
}) {
const categories = Array.from(new Set((bookmarks || []).map((b) => b.category)))


  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      {/* Left: Search & Category */}
      <div className="flex flex-col sm:flex-row gap-2 flex-1">
        <Input
          type="text"
          placeholder="Search bookmarks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border rounded-md px-3 py-2 text-sm"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Right: Toggle Favorite + View Mode */}
      <div className="flex gap-2 items-center">
        <Toggle
          pressed={showFavorites}
          onPressedChange={setShowFavorites}
          aria-label="Toggle favorites"
        >
          <Star className="w-4 h-4" />
        </Toggle>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("grid")}
        >
          <LayoutGrid className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="icon"
          onClick={() => setViewMode("list")}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
