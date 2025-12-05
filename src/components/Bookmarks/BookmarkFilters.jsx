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
import { Star, LayoutGrid, List, Filter, Command, CheckSquare, Trash2, X, CheckCheck } from "lucide-react";

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
  bookmarks = [],
  onOpenCmdK,
  // Selection mode props
  isSelectionMode = false,
  setIsSelectionMode,
  selectedCount = 0,
  totalCount = 0,
  onSelectAll,
  onDeleteSelected
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
      {/* Selection Mode Bar */}
      {isSelectionMode && (
        <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-3 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSelectionMode(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {selectedCount} of {totalCount} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              className="h-8"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              {selectedCount === totalCount ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              disabled={selectedCount === 0}
              className="h-8"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedCount})
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Left: Search & Category */}
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <Button
            variant="outline"
            className="flex-1 justify-between bg-background! pr-1!"
            onClick={onOpenCmdK} // open CmdK on click
          >
            <span className="text-sm truncate">Global search...</span>
            <span className=" flex justify-between items-center bg-accent text-md border px-2 py-0.5 rounded ml-2 flex-shrink-0 gap-1">
              <Command className="h-3 w-3" />
              + K
            </span>
          </Button>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] bg-background!">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-background!">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right: Toggle Favorite + View Mode + Selection Mode */}
        <div className="flex gap-2 items-center">
          {/* Selection Mode Toggle */}
          <Toggle
            pressed={isSelectionMode}
            onPressedChange={setIsSelectionMode}
            aria-label="Toggle selection mode"
            className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <CheckSquare className="w-4 h-4" />
          </Toggle>

          <Toggle
            pressed={showFavoritesOnly}
            onPressedChange={setShowFavoritesOnly}
            aria-label="Toggle favorites"
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
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


    </>
  );
}
