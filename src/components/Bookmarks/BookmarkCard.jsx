import React, { useState, memo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ExternalLink, Edit, Trash2, Star, MoreHorizontal, BookKey, Ellipsis, MoreVertical, FolderSymlink, CheckSquare, Share2 } from "lucide-react"
import placeholder from "@/assets/placeholder.svg"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"

function BookmarkCard({
  bookmark,
  collections,
  onMove,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShare,
  // Selection mode props
  isSelectionMode = false,
  isSelected = false,
  onToggleSelect,
  onEnterSelectionMode
}) {

  const [showActions, setShowActions] = useState(false)
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(bookmark.url).hostname}&sz=64`;

  const handleCardClick = (e) => {
    if (isSelectionMode) {
      e.preventDefault();
      onToggleSelect?.(bookmark.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card
        className={`p-2 pb-0 gap-0 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out relative group h-full flex flex-col ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""
          } ${isSelectionMode ? "cursor-pointer" : ""}`}
        onClick={handleCardClick}
      >
        {/* Selection Checkbox */}
        {isSelectionMode && (
          <div className="absolute top-3 left-3 z-20">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelect?.(bookmark.id)}
              onClick={(e) => e.stopPropagation()}
              className="h-5 w-5 bg-background border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
          </div>
        )}

        <a
          href={isSelectionMode ? undefined : bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          onClick={isSelectionMode ? (e) => e.preventDefault() : undefined}
        >
          {/* Image/Preview */}
          <div
            id="link-preview"
            className="w-full h-50 overflow-hidden rounded-md bg-muted flex items-center justify-center mb-2"
          >
            {bookmark.previewImage ? (
              <img
                src={bookmark.previewImage || placeholder}
                alt={bookmark.title}
                width={640}
                height={400}
                className="object-cover h-full w-full"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <img
                src={faviconUrl}
                alt={`${bookmark.title} favicon`}
                width={64}
                height={64}
                className="w-16 h-16 object-contain"
                loading="lazy"
                decoding="async"
                onError={(e) =>
                (e.currentTarget.src =
                  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#000" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>')
                }
              />
            )}
          </div>
        </a>

        {/* Title & Favorite Icon */}
        <div className="flex flex-col flex-grow p-2">
          {/* Title & Favorite Icon */}
          <div className="flex justify-between items-start mb-2" id="card-content">
            <h3 className="text-xl font-semibold text-primary pr-2 truncate">{bookmark.title}</h3>
            <Button variant="ghost" size="icon" className="flex-shrink-0 h-8 w-8 -mt-1 -mr-1" onClick={(e) => { e.stopPropagation(); onToggleFavorite(bookmark.id, bookmark.isFavorite); }}>
              <Star className={`h-4 w-4 ${bookmark.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`} />
            </Button>
          </div>

          {/* Description & URL (this part grows to fill space) */}
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3 text-ellipsis mb-2 min-h-[3.75rem]">{bookmark.description || "\u00A0"}</p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.8rem] text-primary hover:underline truncate flex items-center mb-2"
              onClick={(e) => isSelectionMode && e.stopPropagation()}
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
                <div className="flex flex-wrap gap-1 mb-3 min-h-[1.75rem]">
                  {tagsArray.slice(0, 5).map((tag, index) => (
                    <Badge key={index} variant="primary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              );
            })()
              /* Always render the wrapper for consistent spacing */
              || <div className="min-h-[1.75rem] mb-3"></div>}

            {/* Category & Date (no border-t) */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-primary">{bookmark.category}</span>
              <span className="text-primary">{new Date(bookmark.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions - Hidden in selection mode */}
        {!isSelectionMode && (
          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-xl font-bold  rounded-lg w-8 h-8 flex items-center justify-center shadow-md cursor-pointer bg-accent">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8}
                className="p-2 rounded-md shadow-lg w-40 bg-background">

                <DropdownMenuLabel className="">
                  Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="text-accent-foreground" />

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    <FolderSymlink className="w-4 h-4 mr-2" />
                    <span>Move to...</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {/* Option to remove from collection */}
                      <DropdownMenuItem onSelect={() => onMove(bookmark.id, null)}>
                        Collections
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {collections.map(collection => (
                        <DropdownMenuItem
                          key={collection.id}
                          onSelect={() => onMove(bookmark.id, collection.id)}
                        >
                          {collection.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(bookmark); }}
                  className="cursor-pointer">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(bookmark.id); }}
                  className="cursor-pointer text-red-500 focus:text-red-500">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>

                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(bookmark.url, "_blank"); }}
                  className="cursor-pointer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit
                </DropdownMenuItem>

                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare?.(bookmark); }}
                  className="cursor-pointer">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEnterSelectionMode?.(bookmark.id);
                  }}
                  className="cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Select
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

// React.memo prevents re-renders when props haven't changed (rerender-memo)
export default memo(BookmarkCard)
