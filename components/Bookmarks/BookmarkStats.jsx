// components/Bookmarks/BookmarkStats.jsx
import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tag, Star, Filter } from "lucide-react"

export default function BookmarkStats({ bookmarks }) {
  // Single pass through bookmarks array (js-combine-iterations)
  const { total, favorites, categories } = useMemo(() => {
    let favCount = 0;
    const categorySet = new Set();
    for (const b of bookmarks) {
      if (b.isFavorite) favCount++;
      categorySet.add(b.category);
    }
    return { total: bookmarks.length, favorites: favCount, categories: categorySet.size };
  }, [bookmarks]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Tag className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Bookmarks</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Favorites</p>
              <p className="text-2xl font-bold">{favorites}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Filter className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
