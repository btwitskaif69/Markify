import { useRef, useState } from 'react';
import PropTypes from "prop-types";
import { useAuth } from "@/client/context/AuthContext";
import { toast } from "sonner";
import { Upload, Download, Settings, FileJson, FileSpreadsheet, FileCode, RefreshCw } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { parseBookmarksHtml, parseChromiumBookmarksJson } from "@/lib/bookmarkParser";

const API_URL = API_BASE_URL;
const BACKGROUND_PREVIEW_CONCURRENCY = 4;

// Helper to convert bookmarks to CSV
const bookmarksToCSV = (bookmarks) => {
  const headers = ['title', 'url', 'description', 'category', 'tags', 'isFavorite'];
  const rows = bookmarks.map(b => [
    `"${(b.title || '').replace(/"/g, '""')}"`,
    `"${(b.url || '').replace(/"/g, '""')}"`,
    `"${(b.description || '').replace(/"/g, '""')}"`,
    `"${(b.category || '').replace(/"/g, '""')}"`,
    `"${(b.tags || '').replace(/"/g, '""')}"`,
    b.isFavorite ? 'true' : 'false'
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
};

// Helper to convert bookmarks to HTML (Netscape format)
const bookmarksToHTML = (bookmarks) => {
  const items = bookmarks.map(b =>
    `    <DT><A HREF="${b.url}" ADD_DATE="${Math.floor(Date.now() / 1000)}">${b.title}</A>\n    <DD>${b.description || ''}`
  ).join('\n');

  return `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Markify Bookmarks</TITLE>
<H1>Markify Bookmarks</H1>
<DL><p>
${items}
</DL><p>`;
};

// Helper to parse CSV to bookmarks
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

  const bookmarks = [];
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (const char of lines[i]) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const bookmark = {};
    headers.forEach((header, idx) => {
      const value = values[idx] || '';
      if (header === 'isfavorite') {
        bookmark.isFavorite = value.toLowerCase() === 'true';
      } else if (header === 'title' || header === 'url' || header === 'description' || header === 'category' || header === 'tags') {
        bookmark[header] = value;
      }
    });

    // Ensure required fields exist
    if (bookmark.title && bookmark.url) {
      bookmark.description = bookmark.description || '';
      bookmark.category = bookmark.category || 'Other';
      bookmark.tags = bookmark.tags || '';
      bookmarks.push(bookmark);
    }
  }

  return bookmarks;
};

const parseBrowserBookmarksContent = (rawText) => {
  const chromiumBookmarks = parseChromiumBookmarksJson(rawText);
  if (chromiumBookmarks.length > 0) {
    return { bookmarks: chromiumBookmarks, sourceLabel: "Chromium Bookmarks file" };
  }

  const htmlBookmarks = parseBookmarksHtml(rawText);
  if (htmlBookmarks.length > 0) {
    return { bookmarks: htmlBookmarks, sourceLabel: "bookmarks HTML export" };
  }

  throw new Error(
    "Unsupported bookmarks file. Select a Chromium 'Bookmarks' file (Chrome/Edge/Brave) or an exported bookmarks HTML file."
  );
};

const pickBrowserBookmarksFile = async () => {
  if (typeof window !== "undefined" && typeof window.showOpenFilePicker === "function") {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        multiple: false,
        excludeAcceptAllOption: false,
        suggestedName: "Bookmarks",
        types: [
          {
            description: "Browser bookmarks",
            accept: {
              "application/json": [".json"],
              "text/html": [".html", ".htm"],
              "text/plain": [".txt"],
            },
          },
        ],
      });
      return fileHandle?.getFile ? fileHandle.getFile() : null;
    } catch (error) {
      // User canceled picker.
      if (error?.name === "AbortError") return null;
      // Fall through to classic input-based picker for stricter browsers.
    }
  }

  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    // Keep unrestricted so extensionless Chromium "Bookmarks" files are selectable.
    input.accept = "";
    input.style.display = "none";

    let settled = false;
    const cleanup = () => {
      if (input.parentNode) {
        input.parentNode.removeChild(input);
      }
    };
    const finish = (file) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(file);
    };

    input.addEventListener(
      "change",
      () => {
        finish(input.files?.[0] || null);
      },
      { once: true }
    );

    const onFocus = () => {
      setTimeout(() => {
        if (!settled && (!input.files || input.files.length === 0)) {
          finish(null);
        }
      }, 200);
    };
    window.addEventListener("focus", onFocus, { once: true });

    document.body.appendChild(input);
    input.click();
  });
};

export default function ImportExport({ onRefetch }) {
  const { authFetch, user } = useAuth();
  const fileInputRef = useRef(null);
  const [importFormat, setImportFormat] = useState(null);
  const [isSyncingBrowser, setIsSyncingBrowser] = useState(false);

  const syncBrowserFromServerFilesystem = async () => {
    const response = await authFetch(`${API_URL}/bookmarks/sync-local`, {
      method: "POST",
    });

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const error = new Error(data?.message || "Server-side browser sync failed.");
      error.status = response.status;
      throw error;
    }

    return data;
  };

  const enrichPreviewsInBackground = (bookmarkIds) => {
    if (!bookmarkIds || bookmarkIds.length === 0) return;

    const total = bookmarkIds.length;
    const queue = [...bookmarkIds];
    let processedCount = 0;
    let enrichedCount = 0;

    toast.info(`Background metadata fetch started for ${total} bookmarks.`, {
      id: 'enrichment-progress'
    });

    const worker = async () => {
      while (queue.length > 0) {
        const bookmarkId = queue.shift();
        if (!bookmarkId) return;

        try {
          const response = await authFetch(`${API_URL}/bookmarks/${bookmarkId}/fetch-preview`, {
            method: 'POST',
          });

          if (response.ok) {
            const result = await response.json().catch(() => null);
            if (!result || result.success !== false) {
              enrichedCount++;
            }
          }
        } catch (err) {
          console.warn(`Failed to enrich bookmark ${bookmarkId}:`, err);
        } finally {
          processedCount++;
          if (processedCount % 5 === 0 || processedCount === total) {
            toast.info(`Fetched ${processedCount}/${total} bookmarks...`, {
              id: 'enrichment-progress'
            });
          }

          if (onRefetch && (processedCount % 15 === 0 || processedCount === total)) {
            void onRefetch();
          }
        }
      }
    };

    const workers = Array.from(
      { length: Math.min(BACKGROUND_PREVIEW_CONCURRENCY, total) },
      () => worker()
    );

    void Promise.all(workers)
      .then(async () => {
        toast.success(`Background metadata fetch complete: ${enrichedCount}/${total} updated.`, {
          id: 'enrichment-progress'
        });
        if (onRefetch) {
          await onRefetch();
        }
      })
      .catch((err) => {
        console.error("Background enrichment error:", err);
        toast.error("Background metadata fetch failed.", {
          id: 'enrichment-progress'
        });
      });
  };

  const importBookmarksIntoLibrary = async (bookmarks, successMessageBuilder) => {
    const response = await authFetch(`${API_URL}/bookmarks/import`, {
      method: "POST",
      body: JSON.stringify(bookmarks),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.message || "Failed to import bookmarks.");
    }

    const message = typeof successMessageBuilder === "function"
      ? successMessageBuilder(data)
      : `${data.createdCount} new bookmarks imported.${data.skippedCount > 0 ? ` ${data.skippedCount} were skipped as duplicates.` : ""}`;

    toast.success(message);

    if (onRefetch) {
      await onRefetch();
    }

    if (data.createdIds?.length > 0) {
      toast.info("Metadata fetching is running in background. You can continue using the dashboard.");
      enrichPreviewsInBackground(data.createdIds);
    }

    return data;
  };

  // Export handlers
  const handleExport = async (format) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/export`);
      if (!response.ok) throw new Error("Export failed.");

      const bookmarks = await response.json();
      const userName = user?.name || 'markify';
      const baseName = `${userName}_bookmarks`.replace(/ /g, '_');

      let content, mimeType, extension;

      switch (format) {
        case 'json':
          content = JSON.stringify(bookmarks, null, 2);
          mimeType = 'application/json';
          extension = 'json';
          break;
        case 'csv':
          content = bookmarksToCSV(bookmarks);
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'html':
          content = bookmarksToHTML(bookmarks);
          mimeType = 'text/html';
          extension = 'html';
          break;
        default:
          throw new Error('Invalid format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${baseName}.${extension}`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success(`Bookmarks exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error("Failed to export bookmarks.");
      console.error("Export error:", error);
    }
  };

  // Import handlers
  const handleImportClick = (format) => {
    setImportFormat(format);
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    let bookmarks = [];

    try {
      switch (importFormat) {
        case 'json':
          bookmarks = JSON.parse(text);
          if (!Array.isArray(bookmarks)) {
            throw new Error("JSON must be an array of bookmarks");
          }
          break;
        case 'csv':
          bookmarks = parseCSV(text);
          break;
        case 'html':
          bookmarks = parseBookmarksHtml(text);
          break;
        default:
          throw new Error("Unknown format");
      }

      if (bookmarks.length === 0) {
        toast.error("No valid bookmarks found in the file.");
        return;
      }

      await importBookmarksIntoLibrary(bookmarks);
    } catch (error) {
      toast.error(error.message || `Invalid ${importFormat?.toUpperCase()} file.`);
      console.error("Import error:", error);
    }

    event.target.value = null;
    setImportFormat(null);
  };

  const getAcceptTypes = () => {
    switch (importFormat) {
      case 'json': return '.json';
      case 'csv': return '.csv';
      case 'html': return '.html,.htm';
      default: return '*';
    }
  };

  const handleSyncBrowserBookmarks = async () => {
    if (isSyncingBrowser) return;

    setIsSyncingBrowser(true);
    try {
      let usedFallbackFileFlow = false;

      // 1) Try legacy one-click sync (works when server runs on the same machine as the browser).
      try {
        const data = await syncBrowserFromServerFilesystem();

        if (data.createdCount === 0) {
          toast.success("All browser bookmarks are already synced.");
        } else {
          const sourceLabel = data.source ? ` from ${data.source}` : "";
          toast.success(
            `${data.createdCount} bookmarks synced${sourceLabel}. ${data.skippedCount} duplicates skipped.`
          );
        }

        if (onRefetch) {
          await onRefetch();
        }

        if (data.createdIds?.length > 0) {
          toast.info("Metadata fetching is running in background. You can continue using the dashboard.");
          enrichPreviewsInBackground(data.createdIds);
        }

        return;
      } catch (serverSyncError) {
        // 2) Fallback for production/cloud deployments where server cannot read the user's local browser profile.
        usedFallbackFileFlow = true;
        console.info("Server-side browser sync unavailable, falling back to client file sync.", serverSyncError);
      }

      if (usedFallbackFileFlow) {
        toast.info("Server auto-sync unavailable here. Select your browser bookmarks file to continue.", {
          description:
            "Use Chrome/Edge/Brave profile file named 'Bookmarks', or an exported bookmarks HTML file.",
        });

        const file = await pickBrowserBookmarksFile();
        if (!file) {
          return;
        }

        const text = await file.text();
        const { bookmarks, sourceLabel } = parseBrowserBookmarksContent(text);

        if (bookmarks.length === 0) {
          toast.info("No valid bookmarks found in the selected file.");
          return;
        }

        await importBookmarksIntoLibrary(bookmarks, (data) =>
          data.createdCount === 0
            ? "All selected browser bookmarks are already synced."
            : `${data.createdCount} bookmarks synced from ${sourceLabel}. ${data.skippedCount} duplicates skipped.`
        );
      }
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
      toast.error(error.message || "Failed to sync browser bookmarks.");
      console.error("Browser sync error:", error);
    } finally {
      setIsSyncingBrowser(false);
    }
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel className="text-sm text-foreground">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="font-semibold">Settings</span>
          </div>
        </SidebarGroupLabel>
      </div>
      <SidebarMenu>
        {/* Import Dropdown */}
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip="Import Bookmarks" className="hover:bg-primary hover:text-primary-foreground">
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              sideOffset={4}
              className="w-48"
            >
              <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleImportClick('json')} className="cursor-pointer">
                <FileJson className="mr-2 h-4 w-4" />
                JSON (.json)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImportClick('csv')} className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleImportClick('html')} className="cursor-pointer">
                <FileCode className="mr-2 h-4 w-4" />
                HTML (Browser)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>

        {/* Export Dropdown */}
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Sync Browser Bookmarks"
            className="hover:bg-primary hover:text-primary-foreground"
            onClick={handleSyncBrowserBookmarks}
            disabled={isSyncingBrowser}
          >
            <RefreshCw className={`h-4 w-4 ${isSyncingBrowser ? "animate-spin" : ""}`} />
            <span>{isSyncingBrowser ? "Syncing Browser..." : "Sync Browser"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton tooltip="Export Bookmarks" className="hover:bg-primary hover:text-primary-foreground">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="right"
              sideOffset={4}
              className="w-48"
            >
              <DropdownMenuLabel>Choose Format</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExport('json')} className="cursor-pointer">
                <FileJson className="mr-2 h-4 w-4" />
                JSON (.json)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')} className="cursor-pointer">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('html')} className="cursor-pointer">
                <FileCode className="mr-2 h-4 w-4" />
                HTML (Browser)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept={getAcceptTypes()}
      />
    </SidebarGroup>
  );
}

ImportExport.propTypes = {
  onRefetch: PropTypes.func,
};
