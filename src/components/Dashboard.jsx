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
import { Sun, Moon, BookA } from "lucide-react";
import { AnimationStyles } from "./theme-animations";
import { useAuth } from "@/context/AuthContext"; 
import { useParams, useNavigate } from "react-router-dom";

// --- CONSTANTS ---
const API_URL = "http://localhost:5000/api";
const INITIAL_FORM_STATE = { title: "", url: "", description: "", tags: "", category: "Other" };

export default function Dashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, authFetch, isLoading: isAuthLoading } = useAuth();
  
  // --- SIMPLIFIED STATE MANAGEMENT ---
  const [bookmarks, setBookmarks] = useState([]);
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Single loading state for data
  const [error, setError] = useState(null);
  
  // Dialog and form state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [previewData, setPreviewData] = useState(null);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewError, setPreviewError] = useState(null);

   // Theme state
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const [animationConfig, setAnimationConfig] = useState({ variant: 'circle', start: 'top-left' });


  const handleThemeToggle = () => {
    const newTheme = isDark ? 'light' : 'dark';
    // This can be based on click position for more advanced effects,
    // but for now, we'll keep it simple.
    const nextAnimation = newTheme === 'dark' ? 'bottom-right' : 'top-left';

    setAnimationConfig({ variant: 'circle-blur', start: nextAnimation });

    if (!document.startViewTransition) {
      // Fallback for unsupported browsers
      setTheme(newTheme);
      return;
    }

    // Use the View Transitions API
    document.startViewTransition(() => {
      // The DOM update that causes the theme change MUST go here
      setTheme(newTheme); 
    });
  };

  // --- DATA & PREVIEW FETCHING ---
 useEffect(() => {
    if (isAuthLoading) return; // Wait for auth check to complete

    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.id === userId) {
      const fetchData = async () => {
        setIsLoading(true); // Use the single loading state
        try {
          const [bookmarksRes, collectionsRes] = await Promise.all([
            authFetch(`${API_URL}/users/${userId}/bookmarks`),
            authFetch(`${API_URL}/collections`),
          ]);

          if (!bookmarksRes.ok || !collectionsRes.ok) throw new Error("Failed to fetch data.");
          
          const bookmarksData = await bookmarksRes.json();
          const collectionsData = await collectionsRes.json();

          setBookmarks(bookmarksData);
          setCollections(collectionsData);
        } catch (err) {
          if (err.message !== 'Session expired') {
            setError(err.message);
            toast.error(err.message);
          }
        } finally {
          setIsLoading(false); // Correctly turn off loading state
        }
      };
      fetchData();
    }
  }, [userId, user, authFetch, isAuthLoading, navigate]);

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
  
  const handleSubmit = async (bookmarkData) => {
    const isEditing = !!editingBookmark;
    const bookmarkId = isEditing ? editingBookmark.id : null; 
    const url = isEditing ? `${API_URL}/bookmarks/${bookmarkId}` : `${API_URL}/users/${user.id}/bookmarks`;
    const method = isEditing ? 'PATCH' : 'POST';
    const dataToSubmit = { ...bookmarkData, previewImage: previewData?.image || null };

    try {
      // Use authFetch for authenticated requests
      const response = await authFetch(url, { method, body: JSON.stringify(dataToSubmit) });
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
      if (err.message !== 'Session expired') {
        toast.error(err.message);
      }
    }
  };
  
const handleDelete = async (id) => {
    const originalBookmarks = bookmarks;
    setBookmarks(prev => prev.filter(b => b.id !== id));
    toast.success("Bookmark deleted.");
    try {
      // Use authFetch for authenticated requests
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete on the server.");
    } catch (err) {
      if (err.message !== 'Session expired') {
        toast.error("Failed to delete. Restoring bookmark.");
        setBookmarks(originalBookmarks);
      }
    }
  };

  const handleToggleFavorite = async (id, currentIsFavorite) => {
    const originalBookmarks = [...bookmarks];
    setBookmarks(prev => prev.map(b => (b.id === id ? { ...b, isFavorite: !b.isFavorite } : b)));
    try {
      // Use authFetch for authenticated requests
      const response = await authFetch(`${API_URL}/bookmarks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      if (!response.ok) throw new Error("Failed to update favorite status.");
      const { bookmark: returnedBookmark } = await response.json();
      setBookmarks(prev => prev.map(b => (b.id === id ? returnedBookmark : b)));
    } catch (err) {
      if (err.message !== 'Session expired') {
        toast.error("Could not update favorite status.");
        setBookmarks(originalBookmarks);
      }
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
  // --- RENDER LOGIC ---
  // The main auth loading screen can be simplified or removed
  if (isAuthLoading) {
    return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
  }
  return (
    <SidebarProvider>
       <AppSidebar collections={collections} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                   <BreadcrumbLink href="#">{user ? `${user.name}'s Bookmarks` : 'Bookmarks'}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
 
              </BreadcrumbList>
            </Breadcrumb>
          </div>

            {/* theme toggle */}
 <AnimationStyles 
        variant={animationConfig.variant} 
        start={animationConfig.start} 
      />

      {/* Your theme toggle button, now using the handler */}
      <div className="flex items-center gap-5">
        <div 
          onClick={handleThemeToggle} 
          // Corrected `ratate-0` to `rotate-0`
          className={`flex items-end cursor-pointer transition-transform duration-1000 ${isDark ? "rotate-180" : "rotate-0"}`}
        >
          {isDark ? (
            <Sun className="h-6 w-6 text-yellow-500 transition-all" />
          ) : (
            <Moon className="h-6 w-6 text-gray-500" />
          )}
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
          isLoading={isLoading} // Pass the single loading state
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}