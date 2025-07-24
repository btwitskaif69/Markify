import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Edit, Trash2, Star, MoreHorizontal, Heart } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import placeholder from "@/assets/placeholder.svg"

export default function BookmarkCard({ bookmark, onEdit, onDelete, onToggleFavorite }) {
  const [showActions, setShowActions] = useState(false)
  return (
    <Card className="relative group overflow-hidden py-0 p-4">
      {/* Image Section */}
      <div className="aspect-video relative overflow-hidden bg-slate-100 rounded-lg">
        <img src={placeholder || "/placeholder.svg"} alt={bookmark.title} className="w-full h-full object-cover" />

        {/* Dropdown Menu - Top Right of Image */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => window.open(bookmark.url, "_blank")}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(bookmark.id)}>
                <Heart className="mr-2 h-4 w-4" />
                {bookmark.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(bookmark.id)} className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Header Section */}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">{bookmark.title}</CardTitle>
            <CardDescription className="truncate text-sm mt-1">{bookmark.url}</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(bookmark.id)} className="flex-shrink-0">
            <Star
              className={`h-4 w-4 ${bookmark.isFavorite ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
            />
          </Button>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="pt-0">
        {/* Description */}
        {bookmark.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{bookmark.description}</p>
        )}

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {bookmark.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{bookmark.category}</span>
          <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>

      {/* Quick Action Buttons (Alternative to dropdown - visible on hover) */}
<div
        className={`absolute right-2 bottom-9 gap-1 bg-background/80 backdrop-blur-sm rounded-md p-1 transition-opacity ${showActions ? "flex opacity-100" : "hidden opacity-0"}`}
      >
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => window.open(bookmark.url, "_blank")}>
          <ExternalLink className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onEdit(bookmark)}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => onDelete(bookmark.id)}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  )
}
