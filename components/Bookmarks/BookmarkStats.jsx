// components/Bookmarks/BookmarkStats.jsx
import { useMemo } from "react"
import PropTypes from "prop-types"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, Star, Filter } from "lucide-react"
import { normalizeBookmarkCategoryValue } from "@/lib/bookmarkCategories"

export default function BookmarkStats({ bookmarks }) {
  // Single pass through bookmarks array (js-combine-iterations)
  const { total, favorites, categories } = useMemo(() => {
    let favCount = 0;
    const categorySet = new Set();
    for (const b of bookmarks) {
      if (b.isFavorite) favCount++;
      categorySet.add(normalizeBookmarkCategoryValue(b.category) || "Other");
    }
    return { total: bookmarks.length, favorites: favCount, categories: categorySet.size };
  }, [bookmarks]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <Card className="col-span-2 md:col-span-1 bg-background border dark:border-white/10 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground font-medium">Total Bookmarks</p>
              <p className="text-3xl font-bold leading-none tracking-tight">{total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl border border-[#ff6900]/20 bg-[#ff6900]/5 flex items-center justify-center shrink-0">
              <Bookmark className="h-5 w-5 text-[#ff6900]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border dark:border-white/10 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground font-medium">Favorites</p>
              <p className="text-3xl font-bold leading-none tracking-tight">{favorites}</p>
            </div>
            <div className="w-12 h-12 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-center shrink-0">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-background border dark:border-white/10 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-muted-foreground font-medium">Categories</p>
              <p className="text-3xl font-bold leading-none tracking-tight">{categories}</p>
            </div>
            <div className="w-12 h-12 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center shrink-0">
              <Filter className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

BookmarkStats.propTypes = {
  bookmarks: PropTypes.array,
};
