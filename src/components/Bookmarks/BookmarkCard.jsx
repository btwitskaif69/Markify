import React, { useState } from "react"
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {ExternalLink, Edit, Trash2, Star, MoreHorizontal, BookKey, Ellipsis, MoreVertical} from "lucide-react"
import placeholder from "@/assets/placeholder.svg"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function BookmarkCard({bookmark, onEdit, onDelete, onToggleFavorite}) {

  const [showActions, setShowActions] = useState(false)

  return (
    <Card className="p-4 gap-3 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out relative group">

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
            {bookmark.tags.split(',').map((tag, i) => (
              <Badge key={i} variant="primary" className="text-xs flex items-center justify-center py-1">
                {tag.trim()}
              </Badge>
            ))}
            </div>
          )}
      </div>


      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{bookmark.category}</span>
          <span>{new Date(bookmark.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Actions */}
      <div className="absolute top-5 right-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
            className="text-xl font-bold  rounded-lg w-8 h-8 flex items-center justify-center shadow-md cursor-pointer bg-accent">
              <MoreVertical className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8}
            className="p-2 rounded-md shadow-lg w-40">
              
            <DropdownMenuLabel className="">
              Settings
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="text-accent-foreground" />

            <DropdownMenuItem onClick={(e) => {e.stopPropagation();onEdit(bookmark);}}
              className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
                Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={(e) => {e.stopPropagation();onDelete(bookmark.id);}}
              className="cursor-pointer">
              <Trash2 className="w-4 h-4 mr-2" />
                Delete
            </DropdownMenuItem>

            <DropdownMenuItem onClick={(e) => {e.stopPropagation();window.open(bookmark.url, "_blank");}}
              className="cursor-pointer">
              <ExternalLink className="w-4 h-4 mr-2" />
                Visit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}
