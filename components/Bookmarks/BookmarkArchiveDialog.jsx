"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  AlertTriangle,
  Clock3,
  ExternalLink,
  FileText,
  Globe,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { formatDateUTC } from "@/lib/date";
import BookmarkArchiveBadge from "./BookmarkArchiveBadge";

const API_URL = API_BASE_URL;

export default function BookmarkArchiveDialog({
  open,
  onOpenChange,
  bookmark,
  authFetch,
  onRefreshArchive,
}) {
  const [archive, setArchive] = useState(bookmark?.archive ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setArchive(bookmark?.archive ?? null);
  }, [bookmark]);

  useEffect(() => {
    if (!open || !bookmark?.id) return;

    let cancelled = false;

    const loadArchive = async () => {
      setIsLoading(true);
      try {
        const response = await authFetch(`${API_URL}/bookmarks/${bookmark.id}/archive`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load saved copy.");
        }

        if (!cancelled) {
          setArchive(result.archive || null);
        }
      } catch (error) {
        if (!cancelled && error.message !== "Session expired") {
          toast.error(error.message || "Failed to load saved copy.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadArchive();

    return () => {
      cancelled = true;
    };
  }, [authFetch, bookmark?.id, open]);

  const handleRefresh = async () => {
    if (!bookmark?.id || !onRefreshArchive) return;

    setIsRefreshing(true);
    try {
      const result = await onRefreshArchive(bookmark.id, { silent: true });
      setArchive(result?.archive || null);

      if (result?.archive?.status === "READY") {
        toast.success("Saved copy updated.");
      } else {
        toast.error(result?.archive?.failureReason || "Saved copy could not be created.");
      }
    } catch (error) {
      if (error.message !== "Session expired") {
        toast.error(error.message || "Failed to refresh saved copy.");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const canonicalUrl = archive?.canonicalUrl || bookmark?.url || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl h-[85vh] p-0 overflow-hidden">
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b px-6 py-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-2xl leading-tight">
                  {bookmark?.title || "Saved copy"}
                </DialogTitle>
                <DialogDescription className="line-clamp-2">
                  {bookmark?.url}
                </DialogDescription>
                <div className="flex flex-wrap items-center gap-2">
                  <BookmarkArchiveBadge archive={archive} />
                  {archive?.wordCount ? (
                    <span className="text-xs text-muted-foreground">
                      {archive.wordCount.toLocaleString()} words
                    </span>
                  ) : null}
                  {archive?.readTimeMinutes ? (
                    <span className="text-xs text-muted-foreground">
                      {archive.readTimeMinutes} min read
                    </span>
                  ) : null}
                  {archive?.archivedAt ? (
                    <span className="text-xs text-muted-foreground">
                      Saved {formatDateUTC(archive.archivedAt)}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.open(bookmark?.url, "_blank")}
                  disabled={!bookmark?.url}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open original
                </Button>
                <Button type="button" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  {archive ? "Refresh copy" : "Create saved copy"}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="grid flex-1 gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="border-b bg-muted/20 px-6 py-5 lg:border-r lg:border-b-0">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Source
                  </p>
                  <div className="mt-3 space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="font-medium">{archive?.siteName || "Unknown site"}</p>
                        <p className="truncate text-muted-foreground">{canonicalUrl}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Captured</p>
                        <p className="text-muted-foreground">
                          {archive?.archivedAt ? formatDateUTC(archive.archivedAt) : "Not yet archived"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Author</p>
                        <p className="text-muted-foreground">{archive?.author || "Unknown"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Summary
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {archive?.excerpt || bookmark?.description || "Create a saved copy to preserve a readable version of this page inside Markify."}
                  </p>
                </div>

                {archive?.failureReason ? (
                  <>
                    <Separator />
                    <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-300">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4" />
                        <div>
                          <p className="font-medium">Archive issue</p>
                          <p className="mt-1 leading-6">{archive.failureReason}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </aside>

            <div className="min-h-0 bg-background">
              <ScrollArea className="h-full">
                <div className="mx-auto max-w-3xl px-6 py-8">
                  {isLoading ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">
                      Loading saved copy...
                    </div>
                  ) : archive?.status === "READY" && archive?.contentHtml ? (
                    <article className="max-w-none">
                      <div
                        className="space-y-5 text-[15px] leading-8 text-foreground/90"
                        dangerouslySetInnerHTML={{ __html: archive.contentHtml }}
                      />
                    </article>
                  ) : (
                    <div className="rounded-2xl border border-dashed p-10 text-center">
                      <h3 className="text-lg font-semibold">No saved copy yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create a durable copy of this page so it stays readable even if the source changes later.
                      </p>
                      <Button type="button" className="mt-5" onClick={handleRefresh} disabled={isRefreshing}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                        Create saved copy
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

BookmarkArchiveDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  bookmark: PropTypes.object,
  authFetch: PropTypes.func.isRequired,
  onRefreshArchive: PropTypes.func,
};
