import React, { useState, useEffect } from 'react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Link as LinkIcon } from 'lucide-react'; // Renamed to avoid conflict with Router Link

export default function CmdK({ bookmarks = [] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(""); // 1. State to hold the search query
  const [previewBookmark, setPreviewBookmark] = useState(null); // 2. State for the bookmark to preview

  // Keyboard shortcut to open/close the palette
  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  
  // 3. Manually filter bookmarks based on the search query
  const filteredBookmarks = bookmarks.filter(bookmark => 
    `${bookmark.title} ${bookmark.description} ${bookmark.tags}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  
  // 4. Update the preview whenever the search results change
  useEffect(() => {
    if (filteredBookmarks.length > 0) {
      setPreviewBookmark(filteredBookmarks[0]);
    } else {
      setPreviewBookmark(null);
    }
  }, [search, bookmarks]); // Rerun when search or the bookmarks list changes

  const handleSelect = (bookmarkUrl) => {
    window.open(bookmarkUrl, '_blank');
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* 5. The CommandInput now updates our local search state */}
      <CommandInput 
        placeholder="Search your bookmarks..."
        value={search}
        onValueChange={setSearch}
      />
      
      {/* --- THIS IS THE NEW TWO-PANEL LAYOUT --- */}
      <div className="grid grid-cols-3">
        
        {/* Left Panel: Search Results */}
        <div className="col-span-1 border-r">
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Bookmarks">
              {filteredBookmarks.map((bookmark) => (
                <CommandItem
                  key={bookmark.id}
                  onSelect={() => handleSelect(bookmark.url)}
                  className="cursor-pointer"
                  // Update preview on hover/focus for better UX
                  onMouseOver={() => setPreviewBookmark(bookmark)}
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span>{bookmark.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </div>

        {/* Right Panel: Preview */}
        <div className="col-span-2 p-4">
          {previewBookmark ? (
            <div>
              <h3 className="font-semibold text-lg mb-4">{previewBookmark.title}</h3>
              {previewBookmark.previewImage ? (
                <img 
                  src={previewBookmark.previewImage} 
                  alt="Bookmark preview"
                  className="rounded-md object-cover w-full aspect-video"
                />
              ) : (
                <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center">
                  <span className="text-muted-foreground">No preview available</span>
                </div>
              )}
            </div>
          ) : (
             <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground">Search to see a preview</span>
            </div>
          )}
        </div>
      </div>
      {/* -------------------------------------- */}
    </CommandDialog>
  );
}