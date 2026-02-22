"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon } from "lucide-react";
import { AnimationStyles } from "../theme-animations";
import { useTheme } from "../theme-provider";
import { useAuth } from "@/client/context/AuthContext";
import { useDashboardData } from "@/client/hooks/useDashboardData";
import { useBookmarkActions } from "@/client/hooks/useBookmarkActions";
import { useCollectionActions } from "@/client/hooks/useCollectionActions";
import { useThemeToggle } from "@/client/hooks/useThemeToggle";
import { usePreview } from "@/client/hooks/usePreview";
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog";
import CollectionFormDialog from "@/components/Collections/CollectionFormDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import ShareDialog from "./ShareDialog";
import Bookmarks from "./Bookmarks";
import SharedItems from "./SharedItems";
import CmdK from "./CmdK";
import WelcomeDialog from "./WelcomeDialog";
import SEO from "@/components/SEO/SEO";

const INITIAL_FORM_STATE = { title: "", url: "", description: "", tags: "", category: "Other" };

export default function Dashboard() {
  const { user, authFetch, isLoading: isAuthLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showWelcome, setShowWelcome] = useState(false);
  const isSharedView = pathname?.endsWith("/shared");

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, user, router]);

  // Check for welcome param (new user onboarding)
  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setShowWelcome(true);
      // Remove the query param from URL.
      const params = new URLSearchParams(searchParams.toString());
      params.delete("welcome");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }
  }, [searchParams, router, pathname]);

  const {
    allBookmarks,
    bookmarks,
    setAllBookmarks,
    collections,
    setCollections,
    isLoading,
    error,
    activeCollection,
    refetchBookmarks,
  } = useDashboardData(user, authFetch, isAuthLoading);

  const {
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    handleToggleFavorite,
    handleMoveBookmark,
    isSubmitting
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

  // Share dialog state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [shareType, setShareType] = useState("bookmark"); // "bookmark" or "collection"

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

  // Share handlers
  const handleShareBookmark = (bookmark) => {
    setShareItem(bookmark);
    setShareType("bookmark");
    setIsShareDialogOpen(true);
  };

  const handleShareCollection = (collection) => {
    setShareItem(collection);
    setShareType("collection");
    setIsShareDialogOpen(true);
  };

  const handleShareToggle = (updatedItem) => {
    if (shareType === "bookmark") {
      setAllBookmarks((prev) =>
        prev.map((b) => (b.id === updatedItem.id ? updatedItem : b))
      );
    } else {
      setCollections((prev) =>
        prev.map((c) => (c.id === updatedItem.id ? updatedItem : c))
      );
    }
    setShareItem(updatedItem);
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        {isAuthLoading ? "Authenticating..." : "Redirecting to login..."}
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Dashboard"
        description="Manage your Markify collections and bookmarks."
        noindex
      />
      <SidebarProvider>
        <AppSidebar
          collections={collections}
          onCreateCollection={handleCreateCollectionClick}
          onRenameCollection={handleRenameCollectionClick}
          onDeleteCollection={openDeleteConfirm}
          onShareCollection={handleShareCollection}
          totalBookmarks={allBookmarks.length}
          onRefetchBookmarks={refetchBookmarks}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild>
                      <Link href={user ? `/dashboard/${user.id}` : "/login"}>
                        {user ? `${user.name}'s Bookmarks` : "Bookmarks"}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {activeCollection && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink>{activeCollection.name}</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
                  {isSharedView && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink>Shared</BreadcrumbLink>
                      </BreadcrumbItem>
                    </>
                  )}
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
                isSubmitting={isSubmitting}
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

          {isSharedView ? (
            <SharedItems
              bookmarks={allBookmarks}
              collections={collections}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              onToggleFavorite={handleToggleFavorite}
              onMove={handleMoveBookmark}
              onShare={handleShareBookmark}
              onRenameCollection={handleRenameCollectionClick}
              onDeleteCollection={openDeleteConfirm}
              onShareCollection={handleShareCollection}
            />
          ) : (
            <Bookmarks
              bookmarks={bookmarks}
              collections={collections}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              onToggleFavorite={handleToggleFavorite}
              onMove={handleMoveBookmark}
              onShare={handleShareBookmark}
            />
          )}

          <CmdK bookmarks={allBookmarks} />
        </SidebarInset>

        <ShareDialog
          open={isShareDialogOpen}
          setOpen={setIsShareDialogOpen}
          item={shareItem}
          type={shareType}
          authFetch={authFetch}
          onShareToggle={handleShareToggle}
        />

        <WelcomeDialog
          open={showWelcome}
          onOpenChange={setShowWelcome}
          userName={user?.name}
        />
      </SidebarProvider>
    </>
  );
}
