import React, { useRef, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Upload, Download, Settings, FileJson, FileSpreadsheet, FileCode } from "lucide-react";
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
import { API_BASE_URL } from "@/lib/apiConfig";
import { parseBookmarksHtml } from "@/lib/bookmarkParser";

const API_URL = API_BASE_URL;

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

export default function ImportExport({ onRefetch }) {
  const { authFetch, user } = useAuth();
  const fileInputRef = useRef(null);
  const [importFormat, setImportFormat] = useState(null);

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

      const response = await authFetch(`${API_URL}/bookmarks/import`, {
        method: 'POST',
        body: JSON.stringify(bookmarks),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      let message = `${data.createdCount} new bookmarks imported.`;
      if (data.skippedCount > 0) {
        message += ` ${data.skippedCount} were skipped as duplicates.`;
      }

      toast.success(message);

      // Refresh UI immediately to show imported bookmarks
      if (onRefetch) {
        onRefetch();
      }

      // Fetch previews one by one for newly created bookmarks (in background)
      if (data.createdIds && data.createdIds.length > 0) {
        toast.info(`Fetching metadata for ${data.createdIds.length} bookmarks...`, {
          id: 'enrichment-progress'
        });

        let enrichedCount = 0;
        for (const bookmarkId of data.createdIds) {
          try {
            await authFetch(`${API_URL}/bookmarks/${bookmarkId}/fetch-preview`, {
              method: 'POST',
            });
            enrichedCount++;

            // Update progress every 5 bookmarks or at the end
            if (enrichedCount % 5 === 0 || enrichedCount === data.createdIds.length) {
              toast.info(`Fetched ${enrichedCount}/${data.createdIds.length} bookmarks...`, {
                id: 'enrichment-progress'
              });
            }
          } catch (err) {
            console.warn(`Failed to enrich bookmark ${bookmarkId}:`, err);
          }
        }

        toast.success(`Done! ${enrichedCount} bookmarks enriched with metadata.`, {
          id: 'enrichment-progress'
        });

        // Refresh again to show updated previews
        if (onRefetch) {
          onRefetch();
        }
      }
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SidebarMenuButton className="w-full hover:bg-primary! hover:text-primary-foreground!" tooltip="Import Bookmarks">
                <Upload className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Import Data</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <SidebarMenuButton className="w-full hover:bg-primary! hover:text-primary-foreground!" tooltip="Export Bookmarks">
                <Download className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Export Data</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
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
