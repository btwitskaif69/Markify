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
        <p className="text-md">{bookmark.description}</p>
                <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary dark:text-primary hover:underline truncate mb-3 flex items-center mt-2"
        >
          <ExternalLink className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{bookmark.url}</span>
        </a>

        {bookmark.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {bookmark.tags.map((tag, i) => (
              <Badge key={i} variant="primary" className="text-xs">
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
