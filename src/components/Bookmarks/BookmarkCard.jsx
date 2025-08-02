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
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`;

  return (
    <Card className="p-2 pb-0 gap-0 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out relative group">
       <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
      {/* Image/Preview */}
      <div id="link-preview" className="w-full h-50 overflow-hidden rounded-md bg-muted flex items-center justify-center mb-2">
        {bookmark.previewImage ? (
          <img 
            src={bookmark.previewImage || placeholder}
            alt={bookmark.title} 
            className="object-cover h-full w-full" 
          />
        ) : (
          <img
            src={faviconUrl}
            alt={`${bookmark.title} favicon`}
            className="w-16 h-16 object-contain"
            // Fallback to a generic icon if the favicon fails to load
            onError={(e) => e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'}
          />
        )}
      </div>
      </a>

      {/* Title & Favorite Icon */}
          <div className="flex flex-col flex-grow p-2">
            {/* Title & Favorite Icon */}
            <div className="flex justify-between items-start mb-2" id="card-content">
              <h3 className="text-xl font-semibold text-primary pr-2 truncate">{bookmark.title}</h3>
              <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 -mt-1 -mr-1" onClick={() => onToggleFavorite(bookmark.id, bookmark.isFavorite)}>
                <Star className={`h-4 w-4 ${bookmark.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
              </Button>
            </div>

            {/* Description & URL (this part grows to fill space) */}
            <div className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3 text-ellipsis mb-2">{bookmark.description}</p>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.8rem] text-primary hover:underline truncate flex items-center mb-2"
              >
                <ExternalLink className="h-[0.8rem] w-[0.8rem] mr-1 flex-shrink-0" />
                <span className="truncate">{bookmark.url}</span>
              </a>
            </div>

            {/* This footer is pushed to the bottom of the card */}
            <div className="mb-2">
              {(() => {
                const tagsArray = typeof bookmark.tags === 'string' 
                  ? bookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean) 
                  : [];

                if (tagsArray.length === 0) return null;

                return (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tagsArray.slice(0, 5).map((tag, index) => (
                      <Badge key={index} variant="primary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                );
              })()}
              
              {/* Category & Date (no border-t) */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-primary">{bookmark.category}</span>
                <span className="text-primary">{new Date(bookmark.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

      {/* Actions */}
      <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
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