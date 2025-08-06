import React, { useRef } from 'react';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";

const API_URL = "http://localhost:5000/api";

export default function ImportExport() {
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
        
        // --- THIS IS THE UPDATED PART ---
        // Create a detailed success message
        let message = `${data.createdCount} new bookmarks imported.`;
        if (data.skippedCount > 0) {
          message += ` ${data.skippedCount} were skipped as duplicates.`;
        }
        
        toast.success(message);
        // ---------------------------------
        
        window.location.reload();
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
    <div className="p-2 space-y-2 group-data-[collapsible=icon]:hidden">
    <Button
    variant="outline"
    className="w-full justify-center hover:bg-primary! hover:text-primary-foreground!"
    onClick={handleImportClick}
  >
    <Upload className="h-4 w-4 mr-2" />
    Import Bookmarks
  </Button>
  <Button
    variant="outline"
    className="w-full justify-center hover:bg-primary! hover:text-primary-foreground!"
    onClick={handleExport}
  >
    <Download className="h-4 w-4 mr-2" />
    Export Bookmarks
  </Button>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    style={{ display: 'none' }}
    accept=".json"
  />
</div>
  );
}