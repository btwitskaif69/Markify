import React, { useState } from "react"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ExternalLink, Edit, Trash2, Star, MoreHorizontal, BookKey} from "lucide-react"
import placeholder from "@/assets/placeholder.svg"

export default function BookmarkCard({bookmark, onEdit, onDelete, onToggleFavorite}) {

  const [showActions, setShowActions] = useState(false)

  return (
    <Card className="p-4 gap-4">

      {/* Image/Preview */}
      <div className="" id="link-preview">
        <img src={placeholder} alt="bookmark.title" className="object-cover rounded-lg"/>
      </div>

      {/* Title & Favorite Icon */}
      <div className="flex justify-between items-center" id="card-content">
        <h1 className="text-xl font-semibold truncate text-primary">{bookmark.title}</h1>
        <Button variant="ghost" size="icon" onClick={() => onToggleFavorite(bookmark.id)}>
            <Star className={`h-4 w-4 ${bookmark.isFavorite? "text-yellow-500 fill-yellow-500": "text-muted-foreground"}`}/>
        </Button>
      </div>

      {/* Description & Url */}
      <div className="">
        <p className="text-md text-muted-foreground">{bookmark.description}</p>
        <span className="text-sm text-muted-foreground truncate">{bookmark.url}</span>

        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.map((tag, i) => (
              <Badge key={i} variant="primary" className="text-xs text-primary">
                {tag}
              </Badge>
            ))}
            </div>
          )}
      </div>


      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{bookmark.category}</span>
          <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
      </div>
    </Card>
  )
}
