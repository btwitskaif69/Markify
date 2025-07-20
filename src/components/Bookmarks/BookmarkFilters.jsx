import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Star, LayoutGrid, List, Filter } from "lucide-react";
import BookmarkCard from "./BookmarkCard"; // adjust path as needed

export default function BookmarkFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  showFavoritesOnly,
  setShowFavoritesOnly,
  viewMode,
  setViewMode,
  categories = [],
  bookmarks = [], // pass bookmarks here too
}) {
  // Filtering logic
  const filteredBookmarks = bookmarks.filter((bookmark) => {
    const matchesSearch = bookmark.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      selectedCategory === "" ||
      bookmark.category === selectedCategory;

    const matchesFavorites = !showFavoritesOnly || bookmark.favorite === true;

    return matchesSearch && matchesCategory && matchesFavorites;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Left: Search & Category */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <Input
            type="text"
            placeholder="Search bookmarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right: Toggle Favorite + View Mode */}
        <div className="flex gap-2 items-center">
          <Toggle
            pressed={showFavoritesOnly}
            onPressedChange={setShowFavoritesOnly}
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

      {/* Render filtered bookmarks */}
      <div
        className={`grid gap-4 ${
          viewMode === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : ""
        }`}
      >
        {filteredBookmarks.length > 0 ? (
          filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No bookmarks found.</p>
        )}
      </div>
    </>
  );
}
