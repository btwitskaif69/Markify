import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLink, Edit, Trash2, Star } from "lucide-react"

export default function BookmarkListItem({
  bookmark,
  onEdit,
  onDelete,
  onToggleFavorite,
  // Selection mode props
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect
}) {
  // Safely splits the tags string into an array to prevent errors
  const tagsArray = typeof bookmark.tags === 'string'
    ? bookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    : [];

  // Uses Google's service for a reliable favicon
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=32`;

  const handleRowClick = () => {
    if (isSelectionMode) {
      onToggleSelect?.(bookmark.id);
    }
  };

  return (
    <Card
      className={`p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""
        } ${isSelectionMode ? "cursor-pointer hover:bg-muted/50" : ""}`}
      onClick={handleRowClick}
    >
      {/* Left Section: Info */}
      <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect?.(bookmark.id)}
            onClick={(e) => e.stopPropagation()}
            className="h-5 w-5 flex-shrink-0 mt-1 sm:mt-0 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        )}

        <img
          src={faviconUrl}
          alt={`${bookmark.title} favicon`}
          className="w-8 h-8 mt-1 sm:mt-0 object-contain flex-shrink-0"
          // Provides a fallback icon if the favicon can't be loaded
          onError={(e) => e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'}
        />
        <div className="min-w-0">
          <h4 className="font-semibold truncate">{bookmark.title}</h4>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:underline block truncate"
            onClick={(e) => isSelectionMode && e.stopPropagation()}
          >
            {bookmark.url}
          </a>
          {tagsArray.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tagsArray.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Metadata & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
        <div className="text-right flex-shrink-0">
          <div className="font-medium text-sm">{bookmark.category}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(bookmark.createdAt).toLocaleDateString()}
          </div>
        </div>
        {/* Hide actions in selection mode */}
        {!isSelectionMode && (
          <div className="flex gap-1 flex-shrink-0">
            <Button size="icon" variant="ghost" onClick={() => onToggleFavorite(bookmark.id, bookmark.isFavorite)}>
              <Star className={`w-4 h-4 ${bookmark.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onEdit(bookmark)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => onDelete(bookmark.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}