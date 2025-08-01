import { useState, useEffect, useCallback } from "react";
import Bookmarks from "./Bookmarks";
import { AppSidebar } from "@/components/app-sidebar";
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog";
import { toast } from "sonner";
import { debounce } from 'lodash';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";

// --- CONSTANTS ---
const USER_ID = "cmdnen4iy0001dgoocud2bvj1";
const API_URL = "http://localhost:5000/api";
const INITIAL_FORM_STATE = { title: "", url: "", description: "", tags: "", category: "Other" };

export default function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [previewData, setPreviewData] = useState(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // --- DATA & PREVIEW FETCHING ---
  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/users/${USER_ID}/bookmarks`);
        if (!response.ok) throw new Error("Failed to fetch data.");
        const data = await response.json();
        setBookmarks(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const fetchPreview = async (url) => {
    if (!url || !url.startsWith("http")) {
      setPreviewData(null);
      return;
    }
    setIsFetchingPreview(true);
    setPreviewData(null);
    setPreviewError(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${API_URL}/preview?url=${encodeURIComponent(url)}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error('No preview available');
      const data = await response.json();
      setFormData(prev => ({ ...prev, title: data.title || prev.title, description: data.description || prev.description,  tags: Array.isArray(data.tags) ? data.tags.join(', ') : (prev.tags || '') }));
      setPreviewData(data);
    } catch (error) {
      if (error.name === 'AbortError') setPreviewError("Can't fetch preview (timed out).");
      else setPreviewError("Can't fetch preview.");
      setPreviewData(null);
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchPreview, 600), []);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setFormData((prev) => ({ ...prev, url: newUrl }));
    debouncedFetch(newUrl);
  };
  
  // --- API HANDLERS ---
  const handleSubmit = async (bookmarkData) => {
    const isEditing = !!editingBookmark;
    const bookmarkId = isEditing ? editingBookmark.id : null; 
    const url = isEditing ? `${API_URL}/bookmarks/${bookmarkId}` : `${API_URL}/users/${USER_ID}/bookmarks`;
    const method = isEditing ? 'PATCH' : 'POST';
    const dataToSubmit = { ...bookmarkData, previewImage: previewData?.image || null };

    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dataToSubmit) });
      if (response.status === 409) {
        const errorData = await response.json();
        toast.error(errorData.message);
        return;
      }
      if (!response.ok) throw new Error(`Failed to submit bookmark.`);
      const { bookmark: returnedBookmark } = await response.json();

      if (isEditing) {
        setBookmarks(prev => prev.map(b => b.id === returnedBookmark.id ? returnedBookmark : b));
        toast.success("Bookmark updated!");
      } else {
        setBookmarks(prev => [returnedBookmark, ...prev]);
        toast.success("Bookmark added!");
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  const handleDelete = async (id) => {
    const originalBookmarks = bookmarks;
    setBookmarks(prev => prev.filter(b => b.id !== id));
    toast.success("Bookmark deleted.");
    try {
      const response = await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete on the server.");
    } catch (err) {
      toast.error("Failed to delete. Restoring bookmark.");
      setBookmarks(originalBookmarks);
    }
  };

  const handleToggleFavorite = async (id, currentIsFavorite) => {
    const originalBookmarks = [...bookmarks];
    setBookmarks(prev => prev.map(b => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)));
    try {
      const response = await fetch(`${API_URL}/bookmarks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update favorite status.");
      const { bookmark: returnedBookmark } = await response.json();
      setBookmarks(prev => prev.map(b => (b.id === id ? returnedBookmark : b)));
    } catch (err) {
      toast.error("Could not update favorite status.");
      setBookmarks(originalBookmarks);
    }
  };

  // --- UI HANDLERS ---
  const handleAddClick = () => {
    setEditingBookmark(null);
    setFormData(INITIAL_FORM_STATE);
    setPreviewData(null);
    setPreviewError(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({ title: bookmark.title, url: bookmark.url, description: bookmark.description, tags: bookmark.tags || "", category: bookmark.category });
    setPreviewData(bookmark.previewImage ? { image: bookmark.previewImage, title: bookmark.title, description: bookmark.description } : null);
    setPreviewError(null);
    setIsDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Username</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Bookmarks</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-5">
            <div onClick={() => setTheme(isDark ? "light" : "dark")} className="cursor-pointer">
              {isDark ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-gray-500" />}
            </div>
            
            <BookmarkFormDialog
              open={isDialogOpen}
              setOpen={setIsDialogOpen}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              editingBookmark={editingBookmark}
              previewData={previewData}
              isFetchingPreview={isFetchingPreview}
              previewError={previewError}
              onUrlChange={handleUrlChange}
              onAddClick={handleAddClick}
            />
          </div>
        </header>

        <Bookmarks
          bookmarks={bookmarks}
          isLoading={isLoading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}