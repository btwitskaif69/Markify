// components/Bookmarks/BookmarkCard.jsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Edit, Trash2, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Heart} from "lucide-react"
import placeholder from "@/assets/placeholder.svg"

export default function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }) {
  return (
    <Card className="relative group">
                        <img
          src={placeholder}
          alt={title}
          className="w-full h-full object-cover"
        />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">
            <img
              src={bookmark.favicon}
              alt={`${bookmark.title} favicon`}
              className="w-4 h-4 object-contain"
              onError={(e) => (e.target.style.display = "none")}
            />
                  <div className="aspect-video relative overflow-hidden bg-slate-700">

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
              <DropdownMenuItem
                className="text-slate-300 hover:text-white hover:bg-slate-700"
                onClick={() => onToggleFavorite(bookmark.id)}
              >
                <Heart className="mr-2 h-4 w-4" />
                {bookmark.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
            <CardTitle className="text-base font-semibold truncate">{bookmark.title}</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(bookmark.id)}>
            <Star
              className={`h-4 w-4 ${bookmark.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
            />
          </Button>
        </div>
        <CardDescription className="truncate text-xs text-muted-foreground">{bookmark.url}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="text-sm line-clamp-3 mb-2">{bookmark.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {bookmark.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{bookmark.category}</span>
          <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>

      {/* Action buttons (visible on hover) */}
      <div className="absolute right-2 top-2 hidden group-hover:flex gap-1">
        <Button size="icon" variant="ghost" onClick={() => window.open(bookmark.url, "_blank")}>
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onEdit(bookmark)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => onDelete(bookmark.id)}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  )
}
