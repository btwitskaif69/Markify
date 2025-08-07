import { useState, useEffect, useCallback } from "react";
import Bookmarks from "./Bookmarks";
import { AppSidebar } from "@/components/app-sidebar";
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog";
import CollectionFormDialog from "@/components/Collections/CollectionFormDialog"; // <-- ADD THIS IMPORT
import ConfirmationDialog from "./ConfirmationDialog";
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
import CmdK from "./cmdK";

// --- CONSTANTS ---
const API_URL = "http://localhost:5000/api";
const INITIAL_FORM_STATE = { title: "", url: "", description: "", tags: "", category: "Other" };

export default function Dashboard() {
  const { userId, collectionId: activeCollectionId } = useParams();
  const navigate = useNavigate();
  const { user, authFetch, isLoading: isAuthLoading } = useAuth();
  
  // --- SIMPLIFIED STATE MANAGEMENT ---
  const [allBookmarks, setAllBookmarks] = useState([]); // New state to hold all bookmarks
  const [bookmarks, setBookmarks] = useState([]); // State for a filtered view
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
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);

  // --- NEW STATE FOR COLLECTION FORM DIALOG ---
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [collectionName, setCollectionName] = useState("");

    // --- NEW STATE for Delete Confirmation ---
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

          setAllBookmarks(bookmarksData); // Store all bookmarks here
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

useEffect(() => {
    if (activeCollectionId) {
      const filtered = allBookmarks.filter(bm => bm.collectionId === activeCollectionId);
      setBookmarks(filtered);
    } else {
      setBookmarks(allBookmarks);
    }
  }, [activeCollectionId, allBookmarks]);

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
      setIsBookmarkDialogOpen(false);
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
    setFormData({ ...INITIAL_FORM_STATE, collectionId: activeCollectionId || "" });
    setPreviewData(null);
    setPreviewError(null);
    setIsBookmarkDialogOpen(true); // This will now work
  };

  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({ 
      title: bookmark.title, 
      url: bookmark.url, 
      description: bookmark.description, 
      tags: bookmark.tags || "", 
      category: bookmark.category,
      collectionId: bookmark.collectionId || "" 
    });
    setPreviewData(bookmark.previewImage ? { image: bookmark.previewImage, title: bookmark.title, description: bookmark.description } : null);
    setPreviewError(null);
    setIsBookmarkDialogOpen(true); // This will now work
  };

    // --- NEW HANDLERS FOR COLLECTIONS ---

  // Handles both creating and renaming a collection
   const handleCollectionSubmit = async (collectionData) => {
    const isEditing = !!editingCollection;
    const url = isEditing ? `${API_URL}/collections/${collectionData.id}` : `${API_URL}/collections`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await authFetch(url, {
        method,
        body: JSON.stringify({ name: collectionData.name }),
      });
      if (response.status === 409) {
        const err = await response.json();
        throw new Error(err.message);
      }
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'rename' : 'create'} collection.`);
      
      const { collection: returnedCollection } = await response.json();

      if (isEditing) {
        setCollections(prev => prev.map(c => c.id === returnedCollection.id ? returnedCollection : c));
        toast.success("Collection renamed!");
      } else {
        setCollections(prev => [...prev, returnedCollection].sort((a, b) => a.name.localeCompare(b.name)));
        toast.success("Collection created!");
      }
      setIsCollectionDialogOpen(false);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    const originalCollections = [...collections];
    setCollections(prev => prev.filter(c => c.id !== collectionId));
    toast.success("Collection deleted.");
    try {
      const response = await authFetch(`${API_URL}/collections/${collectionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete on server.");
    } catch (err) {
      toast.error("Failed to delete. Restoring collection.");
      setCollections(originalCollections);
    }
  };
  
  // --- NEW UI HANDLERS for Delete Flow ---

  // Called when the user clicks the "Delete" menu item
  const openDeleteConfirm = (collectionId) => {
    setItemToDelete(collectionId);
    setIsConfirmOpen(true);
  };
  
  // Called when the user clicks "Continue" in the confirmation dialog
  const confirmDelete = () => {
    if (itemToDelete) {
      handleDeleteCollection(itemToDelete);
      setItemToDelete(null);
    }
    setIsConfirmOpen(false);
  };

  // --- UI HANDLERS FOR OPENING THE DIALOG ---

  // Called when the '+' button in NavCollections is clicked
  const handleCreateCollectionClick = () => {
    setEditingCollection(null);
    setCollectionName("");
    setIsCollectionDialogOpen(true);
  };

  // Called when the 'Rename' option is clicked for a collection
  const handleRenameCollectionClick = (collection) => {
    setEditingCollection(collection);
    setCollectionName(collection.name);
    setIsCollectionDialogOpen(true);
  };

  // --- RENDER LOGIC ---
  // The main auth loading screen can be simplified or removed
  if (isAuthLoading) {
    return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
  }


   // --- NEW HANDLER for moving a bookmark ---
// src/components/Dashboard.jsx

const handleMoveBookmark = async (bookmarkId, collectionId) => {
  try {
    const response = await authFetch(`${API_URL}/bookmarks/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify({ collectionId }),
    });

    if (!response.ok) throw new Error("Failed to move bookmark.");
    
    const { bookmark: returnedBookmark } = await response.json();
    
    // Update the bookmark in the main list
    setAllBookmarks(prev => prev.map(b => b.id === returnedBookmark.id ? returnedBookmark : b));

    // --- THIS IS THE UPDATED PART ---
    // Find the collection name to display in the toast
    let toastMessage = "Bookmark moved successfully!";
    if (collectionId) {
      const collection = collections.find(c => c.id === collectionId);
      if (collection) {
        toastMessage = `Bookmark moved to "${collection.name}"!`;
      }
    } else {
      toastMessage = "Bookmark removed from collection.";
    }
    
    toast.success(toastMessage);
    // --------------------------------

  } catch (err) {
    toast.error("Failed to move bookmark.");
  }
};

  return (
    <SidebarProvider>
       <AppSidebar 
        collections={collections} 
        onCreateCollection={handleCreateCollectionClick}
        onRenameCollection={handleRenameCollectionClick}
        onDeleteCollection={openDeleteConfirm}
      />
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
              open={isBookmarkDialogOpen}
              setOpen={setIsBookmarkDialogOpen}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              editingBookmark={editingBookmark}
              previewData={previewData}
              isFetchingPreview={isFetchingPreview}
              previewError={previewError}
              onUrlChange={handleUrlChange}
              onAddClick={handleAddClick}
              collections={collections} 
            />
          </div>
        </header>

          <ConfirmationDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={confirmDelete}
          title="Delete Collection?"
          description="Are you sure you want to delete this collection? Bookmarks within it will not be deleted."
        />

          {/* 3. Render the CollectionFormDialog */}
        <CollectionFormDialog
          open={isCollectionDialogOpen}
          setOpen={setIsCollectionDialogOpen}
          onSubmit={handleCollectionSubmit}
          editingCollection={editingCollection}
          collectionName={collectionName}
          setCollectionName={setCollectionName}
        />

        <Bookmarks
           bookmarks={bookmarks}
           collections={collections}
          isLoading={isLoading} // Pass the single loading state
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onMove={handleMoveBookmark}
        />
        <CmdK bookmarks={allBookmarks}/>
      </SidebarInset>
    </SidebarProvider>
  );
}