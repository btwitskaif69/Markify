import { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon } from "lucide-react";
import { AnimationStyles } from "../theme-animations";
import { useTheme } from "../theme-provider";
import { useAuth } from "@/context/AuthContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import { useBookmarkActions } from "../../hooks/useBookmarkActions";
import { useCollectionActions } from "../../hooks/useCollectionActions";
import { useThemeToggle } from "../../hooks/useThemeToggle";
import { usePreview } from "../../hooks/usePreview";
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog";
import CollectionFormDialog from "@/components/Collections/CollectionFormDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import Bookmarks from "./Bookmarks";
import CmdK from "./CmdK";

const INITIAL_FORM_STATE = { title: "", url: "", description: "", tags: "", category: "Other" };

export default function Dashboard() {
  const { user, authFetch, isLoading: isAuthLoading } = useAuth();
  const { theme, setTheme } = useTheme();

const {
  allBookmarks,
  bookmarks,
  setAllBookmarks,
  collections,
  setCollections, // ← Now available
  isLoading,
  error
} = useDashboardData(user, authFetch, isAuthLoading);

const {
  handleSubmit,
  handleDelete,
  handleToggleFavorite,
  handleMoveBookmark
} = useBookmarkActions(authFetch, user, setAllBookmarks, collections);


  const {
    isCollectionDialogOpen,
    setIsCollectionDialogOpen,
    editingCollection,
    collectionName,
    setCollectionName,
    isConfirmOpen,
    setIsConfirmOpen,
    handleCollectionSubmit,
    handleCreateCollectionClick,
    handleRenameCollectionClick,
    openDeleteConfirm,
    confirmDelete,
  } = useCollectionActions(authFetch, setCollections);

  const { isDark, animationConfig, handleThemeToggle } = useThemeToggle(theme, setTheme);

  const { previewData, isFetchingPreview, previewError, debouncedFetch, setPreviewData, setPreviewError } = usePreview();

  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const handleAddClick = () => {
    setEditingBookmark(null);
    setFormData({ ...INITIAL_FORM_STATE });
    setPreviewData(null);
    setPreviewError(null);
    setIsBookmarkDialogOpen(true);
  };

  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description,
      tags: bookmark.tags || "",
      category: bookmark.category,
      collectionId: bookmark.collectionId || "",
    });
    setPreviewData(
      bookmark.previewImage
        ? { image: bookmark.previewImage, title: bookmark.title, description: bookmark.description }
        : null
    );
    setPreviewError(null);
    setIsBookmarkDialogOpen(true);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setFormData((prev) => ({ ...prev, url: newUrl }));
    debouncedFetch(newUrl, setFormData);
  };

  if (isAuthLoading) {
    return <div className="flex justify-center items-center h-screen">Authenticating...</div>;
  }

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
                  <BreadcrumbLink href="#">
                    {user ? `${user.name}'s Bookmarks` : "Bookmarks"}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <AnimationStyles variant={animationConfig.variant} start={animationConfig.start} />

          <div className="flex items-center gap-5">
            <div
              onClick={handleThemeToggle}
              className={`flex items-end cursor-pointer transition-transform duration-1000 ${isDark ? "rotate-180" : "rotate-0"}`}
            >
              {isDark ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-gray-500" />}
            </div>

            <BookmarkFormDialog
              open={isBookmarkDialogOpen}
              setOpen={setIsBookmarkDialogOpen}
              formData={formData}
              setFormData={setFormData}
              onSubmit={(data) => handleSubmit(data, editingBookmark, previewData, () => setIsBookmarkDialogOpen(false))}
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
          isLoading={isLoading}
          error={error}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onMove={handleMoveBookmark}
        />

        <CmdK bookmarks={allBookmarks} />
      </SidebarInset>
    </SidebarProvider>
  );
}
