import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Link as LinkIcon } from 'lucide-react';

export default function CmdK({ bookmarks = [] }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [previewBookmark, setPreviewBookmark] = useState(null);

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
  
  const filteredBookmarks = bookmarks.filter(bookmark => 
    `${bookmark.title} ${bookmark.description} ${bookmark.tags}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );
  
  // --- THIS useEffect WAS REMOVED ---
  // It was overriding the onMouseOver behavior.
  // By removing it, the hover effect will now work correctly.

  const handleSelect = (bookmarkUrl) => {
    window.open(bookmarkUrl, '_blank');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-[90vw] md:max-w-4xl lg:max-w-5xl overflow-hidden p-0 shadow-lg flex flex-col max-h-[70vh]">
        <Command label="Command Menu" className="flex flex-col flex-grow overflow-hidden bg-background!">
          <CommandInput 
            placeholder="Search your bookmarks..."
            value={search}
            onValueChange={setSearch}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 border-t flex-grow overflow-hidden">
            <div className="md:border-r flex flex-col overflow-hidden">
              <CommandList className="max-h-[500px] overflow-y-auto p-1">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Bookmarks">
                  {filteredBookmarks.map((bookmark) => (
                    <CommandItem
                      key={bookmark.id}
                      onSelect={() => handleSelect(bookmark.url)}
                      className="cursor-pointer"
                      onMouseOver={() => setPreviewBookmark(bookmark)}
                    >
                      <LinkIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{bookmark.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>

<div className="hidden md:flex items-center justify-center p-5 overflow-y-auto">
  {previewBookmark ? (
    <div className="w-full">
      <h3 className="font-semibold text-lg mb-4 truncate">{previewBookmark.title}</h3>
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
        </Command>
      </DialogContent>
    </Dialog>
  );
}