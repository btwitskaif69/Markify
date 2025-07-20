// components/Bookmarks/BookmarkListItem.jsx
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Edit, Trash2 } from "lucide-react"

export default function BookmarkListItem({ bookmark, onEdit, onDelete }) {
  return (
    <Card className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left Section */}
      <div className="flex items-start sm:items-center gap-3 flex-1">
        <img
          src={bookmark.favicon}
          alt="favicon"
          className="w-6 h-6 mt-1 sm:mt-0 object-contain"
          onError={(e) => (e.target.style.display = "none")}
        />
        <div>
          <h4 className="font-medium text-sm">{bookmark.title}</h4>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline block"
          >
            {bookmark.url}
          </a>
          <p className="text-xs mt-1 line-clamp-2">{bookmark.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex gap-2 items-center justify-end sm:flex-col sm:items-end sm:gap-1">
        <span className="text-xs text-muted-foreground">{bookmark.category}</span>
        <div className="flex gap-1">
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
      </div>
    </Card>
  )
}
