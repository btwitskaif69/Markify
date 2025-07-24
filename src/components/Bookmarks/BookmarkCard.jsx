import React, { useState } from "react"
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink, Edit, Trash2, Star, MoreHorizontal
} from "lucide-react"
import placeholder from "@/assets/placeholder.svg"

export default function BookmarkCard({
  bookmark, onEdit, onDelete, onToggleFavorite
}) {
  const [showActions, setShowActions] = useState(false)

  return (
    <Card
      className="relative overflow-hidden py-0 p-4"
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Image + “More” Trigger */}
      <div className="aspect-video relative overflow-hidden bg-slate-100 rounded-lg">
        <img
          src={placeholder}
          alt={bookmark.title}
          className="w-full h-full object-cover"
        />
        {/* More Button */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation()
            setShowActions((v) => !v)
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Header */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {bookmark.title}
            </CardTitle>
            <CardDescription className="truncate text-sm mt-1">
              {bookmark.url}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(bookmark.id)}
          >
            <Star
              className={`h-4 w-4 ${
                bookmark.isFavorite
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
          </Button>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="pt-0">
        {bookmark.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
            {bookmark.description}
          </p>
        )}
        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags.map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{bookmark.category}</span>
          <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>

      {/* Quick‑action overlay */}
      {showActions && (
        <div className="absolute right-2 bottom-9 flex gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              window.open(bookmark.url, "_blank")
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(bookmark)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(bookmark.id)
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      )}
    </Card>
  )
}
