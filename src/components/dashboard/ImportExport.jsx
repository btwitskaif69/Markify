import React, { useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Upload, Download, Settings } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"}/api`;

export default function ImportExport({ onRefetch }) {
  const { authFetch, user } = useAuth();
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/export`);
      if (!response.ok) throw new Error("Export failed.");
      
      const bookmarks = await response.json();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(bookmarks, null, 2)
      )}`;
      
      const link = document.createElement("a");
      link.href = jsonString;
      const fileName = user ? `${user.name}_bookmarks.json` : 'markify_bookmarks.json';
      link.download = fileName.replace(/ /g, '_');
      link.click();

      toast.success("Bookmarks exported successfully!");
    } catch (error) {
      toast.error("Failed to export bookmarks.");
      console.error("Export error:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const bookmarks = JSON.parse(e.target.result);
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
        
        if (onRefetch) {
          onRefetch();
        } else {
          window.location.reload();
        }
      } catch (error) {
        toast.error(error.message || "Invalid JSON file.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
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
        <SidebarMenuItem>
          <SidebarMenuButton className="w-full hover:bg-primary! hover:text-primary-foreground!" onClick={handleImportClick} tooltip="Import Data">
            <Upload className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Import Data</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton className="w-full hover:bg-primary! hover:text-primary-foreground!" onClick={handleExport} tooltip="Export Data">
            <Download className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Export Data</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".json"
      />
    </SidebarGroup>
  );
}