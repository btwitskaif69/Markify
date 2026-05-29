"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Sun, Moon, RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimationStyles } from "../theme-animations";
import { useTheme } from "../theme-provider";
import { useAuth } from "@/client/context/AuthContext";
import { useDashboardData } from "@/client/hooks/useDashboardData";
import { useBookmarkActions } from "@/client/hooks/useBookmarkActions";
import { useCollectionActions } from "@/client/hooks/useCollectionActions";
import { useThemeToggle } from "@/client/hooks/useThemeToggle";
import { usePreview } from "@/client/hooks/usePreview";
import {
  consumeOnboardingPending,
  hasOnboardingSeen,
  markOnboardingSeen,
} from "@/client/lib/onboardingPrompt";
import BookmarkFormDialog from "@/components/Bookmarks/BookmarkFormDialog";
import BookmarkArchiveDialog from "@/components/Bookmarks/BookmarkArchiveDialog";
import CollectionFormDialog from "@/components/Collections/CollectionFormDialog";
import ConfirmationDialog from "./ConfirmationDialog";
import ShareDialog from "./ShareDialog";
import Bookmarks from "./Bookmarks";
import SharedItems from "./SharedItems";
import BillingDashboard from "./BillingDashboard";
import CmdK from "./CmdK";
import OnboardingDialog from "./OnboardingDialog";
import SEO from "@/components/SEO/SEO";
import { BOOKMARK_CATEGORY_OPTIONS } from "@/lib/bookmarkCategories";
import { toast } from "sonner";

const INITIAL_FORM_STATE = {
  title: "",
  url: "",
  description: "",
  tags: "",
  category: "__auto__",
  collectionId: "",
};

export default function Dashboard() {
  const { user, authFetch, token, isLoading: isAuthLoading, hasProAccess, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isSharedView = pathname?.endsWith("/shared");
  const isBillingView = pathname?.endsWith("/billing");
  const dashboardPath = user ? `/dashboard/${user.id}` : "/login";
  const billingPath = user ? `/dashboard/${user.id}/billing` : "/login";
  const billingRedirectPath = isBillingView ? billingPath : dashboardPath;
  const [showWelcome, setShowWelcome] = useState(false);
  const sharedRedirectNotifiedRef = useRef(false);
  const billingSyncHandledRef = useRef(false);
  const onboardingCompletionRef = useRef(false);
  const billingSuccess = searchParams.get("billing") === "success" || searchParams.get("success") === "true";
  const billingSubscriptionId = searchParams.get("subscription_id") || "";

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.replace("/login");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (isAuthLoading || !user) {
      return;
    }

    if (!billingSuccess) {
      billingSyncHandledRef.current = false;
      return;
    }

    if (billingSyncHandledRef.current) {
      return;
    }

    if (!billingSubscriptionId || !token) {
      router.replace(billingRedirectPath);
      return;
    }

    billingSyncHandledRef.current = true;

    const syncSubscription = async () => {
      try {
        const response = await fetch("/api/billing/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscriptionId: billingSubscriptionId,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result?.message || "Failed to synchronize subscription.");
        }

        if (result?.user) {
          updateProfile(result.user);
        }

        localStorage.removeItem("markify_pending_subscription");

        toast.success("Pro subscription activated.");
      } catch (error) {
        console.error("Subscription sync failed:", error);
        toast.error(error?.message || "Could not verify your subscription yet.");
      } finally {
        router.replace(billingRedirectPath);
      }
    };

    void syncSubscription();
  }, [
    isAuthLoading,
    user,
    billingSuccess,
    billingSubscriptionId,
    token,
    updateProfile,
    router,
    dashboardPath,
    billingRedirectPath,
  ]);

  useEffect(() => {
    if (isAuthLoading || !user || !isSharedView || hasProAccess) {
      sharedRedirectNotifiedRef.current = false;
      return;
    }

    if (!sharedRedirectNotifiedRef.current) {
      sharedRedirectNotifiedRef.current = true;
      toast.error("Shared items are available on Pro.");
    }

    router.replace(dashboardPath);
  }, [isAuthLoading, user, isSharedView, hasProAccess, router, dashboardPath]);

  // Check for welcome param (new user onboarding)
  useEffect(() => {
    if (!user) {
      return;
    }

    const hasWelcomeQuery = searchParams.get("welcome") === "true";
    const shouldShowOnboarding =
      hasWelcomeQuery ||
      consumeOnboardingPending(user.id) ||
      (user.showOnboarding === true && !hasOnboardingSeen(user.id));

    if (shouldShowOnboarding) {
      if (globalThis.process?.env?.NODE_ENV === "development") {
        console.debug("[onboarding] dashboard trigger detected", {
          userId: user.id,
          source: user.showOnboarding === true ? "profile" : hasWelcomeQuery ? "query" : "pending",
        });
      }

      setShowWelcome(true);
      if (hasWelcomeQuery) {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("welcome");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      }
    }
  }, [searchParams, router, pathname, user]);

  const handleOnboardingOpenChange = useCallback((nextOpen) => {
    setShowWelcome(nextOpen);

    if (!nextOpen && user?.id) {
      markOnboardingSeen(user.id);

      if (!onboardingCompletionRef.current) {
        onboardingCompletionRef.current = true;
        authFetch("/api/users/onboarding", { method: "PATCH" })
          .then(async (response) => {
            const result = await response.json();
            if (!response.ok) {
              throw new Error(result?.message || "Failed to update onboarding status.");
            }

            if (result?.user) {
              updateProfile(result.user);
            }
          })
          .catch((error) => {
            console.warn("Onboarding completion update failed:", error);
          });
      }
    }
  }, [authFetch, updateProfile, user?.id]);

  const {
    allBookmarks,
    bookmarks,
    setAllBookmarks,
    collections,
    setCollections,
    isLoading,
    isRefreshing,
    error,
    activeCollection,
    refetchBookmarks,
    getBookmarksSnapshot,
  } = useDashboardData(user, authFetch, isAuthLoading);

  const bookmarkCategories = BOOKMARK_CATEGORY_OPTIONS;

  const {
    handleSubmit,
    handleDelete,
    handleBulkDelete,
    handleToggleFavorite,
    handleMoveBookmark,
    handleRefreshArchive,
    isSubmitting
  } = useBookmarkActions(authFetch, user, setAllBookmarks, collections, {
    bookmarkCount: allBookmarks.length,
    getBookmarksSnapshot,
  });


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
  } = useCollectionActions(authFetch, setCollections, {
    collectionCount: collections.length,
    user,
  });

  const { isDark, animationConfig, handleThemeToggle } = useThemeToggle(theme, setTheme);

  const { previewData, isFetchingPreview, previewError, debouncedFetch, setPreviewData, setPreviewError } = usePreview();

  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  // Share dialog state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  const [shareType, setShareType] = useState("bookmark"); // "bookmark" or "collection"
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [archiveBookmarkId, setArchiveBookmarkId] = useState(null);

  const selectedArchiveBookmark = useMemo(() => {
    if (!archiveBookmarkId) return null;
    return allBookmarks.find((bookmark) => bookmark.id === archiveBookmarkId) || null;
  }, [allBookmarks, archiveBookmarkId]);

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
      category: bookmark.category || "__auto__",
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

  const handleViewArchive = (bookmark) => {
    setArchiveBookmarkId(bookmark.id);
    setIsArchiveDialogOpen(true);
  };

  const handleShareToggle = (updatedItem) => {
    if (shareType === "bookmark") {
      const nextBookmarks = getBookmarksSnapshot().map((b) =>
        b.id === updatedItem.id ? updatedItem : b
      );
      setAllBookmarks(nextBookmarks);
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

  if (isSharedView && !hasProAccess) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Redirecting to your bookmarks.
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
            <div className="flex items-center gap-1">
              <SidebarTrigger className="-ml-1 size-6 [&>svg]:size-4" />
              <Separator orientation="vertical" className="mr-1 h-4" />
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
                  {isBillingView && (
                    <>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink>Billing</BreadcrumbLink>
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
              {!isBillingView && (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void refetchBookmarks({ force: true })}
                        disabled={isLoading || isRefreshing}
                        className="gap-2"
                        aria-label="Sync dashboard"
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoading || isRefreshing ? "animate-spin" : ""}`} />
                        {isRefreshing ? "Syncing..." : "Sync Dashboard"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" variant="neutral">
                      Reload latest data.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <div
                onClick={handleThemeToggle}
                className={`flex items-end cursor-pointer transition-transform duration-1000 ${isDark ? "rotate-180" : "rotate-0"}`}
              >
                {isDark ? <Sun className="h-6 w-6 text-yellow-500" /> : <Moon className="h-6 w-6 text-gray-500" />}
              </div>

              {isBillingView && (
                <Button asChild>
                  <Link href={dashboardPath}>Dashboard</Link>
                </Button>
              )}

              {!isBillingView && (
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
                  categories={bookmarkCategories}
                  isSubmitting={isSubmitting}
                />
              )}
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

          {isBillingView ? (
            <BillingDashboard />
          ) : isSharedView ? (
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
              onViewArchive={handleViewArchive}
              onRefreshArchive={handleRefreshArchive}
              onRenameCollection={handleRenameCollectionClick}
              onDeleteCollection={openDeleteConfirm}
              onShareCollection={handleShareCollection}
              canShare={hasProAccess}
            />
          ) : (
            <Bookmarks
              bookmarks={bookmarks}
              collections={collections}
              categories={bookmarkCategories}
              isLoading={isLoading}
              error={error}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
              onToggleFavorite={handleToggleFavorite}
              onMove={handleMoveBookmark}
              onShare={handleShareBookmark}
              onViewArchive={handleViewArchive}
              onRefreshArchive={handleRefreshArchive}
              canShare={hasProAccess}
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

        <BookmarkArchiveDialog
          open={isArchiveDialogOpen}
          onOpenChange={setIsArchiveDialogOpen}
          bookmark={selectedArchiveBookmark}
          authFetch={authFetch}
          onRefreshArchive={handleRefreshArchive}
        />

        <OnboardingDialog
          open={showWelcome}
          onOpenChange={handleOnboardingOpenChange}
          userName={user?.name}
        />
      </SidebarProvider>
    </>
  );
}
