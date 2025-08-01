import { useState, useEffect } from "react";
import Bookmarks from "./Bookmarks"; // The display component
import { AppSidebar } from "@/components/app-sidebar";
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog";
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
const USER_ID = "cmdnen4iy0001dgoocud2bvj1"; // In a real app, this comes from auth
const API_URL = "http://localhost:5000/api";
const INITIAL_FORM_STATE = { title: "", url: "", description: "", tags: "", category: "Other" };

export default function Dashboard() {
  // --- STATE MANAGEMENT (Now lives in Dashboard) ---
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // --- DATA FETCHING ---
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  // --- API HANDLERS ---
  const handleSubmit = async (bookmarkData) => {
    const isEditing = !!editingBookmark;
    const url = isEditing ? `${API_URL}/bookmarks/${bookmarkData.id}` : `${API_URL}/users/${USER_ID}/bookmarks`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookmarkData),
      });
      if (!response.ok) throw new Error(`Failed to ${isEditing ? 'update' : 'add'} bookmark.`);
      const { bookmark: returnedBookmark } = await response.json();

      if (isEditing) {
        setBookmarks(prev => prev.map(b => b.id === returnedBookmark.id ? returnedBookmark : b));
      } else {
        setBookmarks(prev => [returnedBookmark, ...prev]);
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/bookmarks/${id}`, { method: 'DELETE' });
      setBookmarks(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleToggleFavorite = async (id, currentIsFavorite) => {
    try {
      const response = await fetch(`${API_URL}/bookmarks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: !currentIsFavorite }),
      });
      const { bookmark: returnedBookmark } = await response.json();
      setBookmarks(prev => prev.map(b => b.id === id ? returnedBookmark : b));
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  // --- UI HANDLERS ---
  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      tags: bookmark.tags || "",
      category: bookmark.category,
    });
    setIsDialogOpen(true);
  };

  // --- RENDER LOGIC ---
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>{/* ...breadcrumb items */}</Breadcrumb>
          </div>

            <div className="flex items-center gap-5">
            <div onClick={() => setTheme(isDark ? "light" : "dark")} className={`flex items-end cursor-pointer transition-transform duration-500 ${isDark ? "rotate-180" : "ratate-0"}`}>
            {isDark ? <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all" /> : <Moon className="h-6 w-6 text-gray-500" />}
            </div>
            
            <BookmarkFormDialog
              open={isDialogOpen}
              setOpen={setIsDialogOpen}
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              editingBookmark={editingBookmark}
              setEditingBookmark={setEditingBookmark}
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