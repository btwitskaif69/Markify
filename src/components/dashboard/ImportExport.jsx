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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileJson, FileCode, FileText } from "lucide-react";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"}/api`;

export default function ImportExport({ onRefetch }) {
  const { authFetch, user } = useAuth();
  const fileInputRef = useRef(null);

  const handleExport = async (format) => {
    try {
      const response = await authFetch(`${API_URL}/bookmarks/export/${format}`);
      if (!response.ok) throw new Error("Export failed.");

      const fileName = `${user.name}_bookmarks.${format}`.replace(/ /g, '_');
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);

      toast.success(`Bookmarks exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error("Failed to export bookmarks.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target.result;
        let response;
        let endpoint = '';
        let body = {};

        if (file.type.includes('json')) {
          endpoint = 'import';
          body = JSON.parse(content);
        } else if (file.type.includes('html')) {
          endpoint = 'import/html';
          body = { htmlContent: content };
        } else if (file.type.includes('csv')) {
          endpoint = 'import/csv';
          body = { csvContent: content };
        } else {
          throw new Error("Unsupported file type.");
        }

        response = await authFetch(`${API_URL}/bookmarks/${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        
        toast.success(data.message);
        if (onRefetch) onRefetch();
      } catch (error) {
        toast.error(error.message || "Invalid file.");
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
      </div>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => fileInputRef.current.click()} tooltip="Import Data">
            <Upload className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Import</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Export Data">
                <Download className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Export</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" sideOffset={8}>
            <DropdownMenuItem onSelect={() => handleExport('json')} className="cursor-pointer">
              <FileJson className="mr-2 h-4 w-4" />
              <span>Export as JSON</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleExport('html')} className="cursor-pointer">
              <FileCode className="mr-2 h-4 w-4" />
              <span>Export as HTML</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleExport('csv')} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>Export as CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenu>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".json, .html, .csv" // Accept all supported file types
      />
    </SidebarGroup>
  );
}