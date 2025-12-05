import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { parseBookmarksHtml } from "@/lib/bookmarkParser";
import { toast } from "sonner";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ImportBookmarks({ onImport }) {
    const fileInputRef = useRef(null);
    const [isImporting, setIsImporting] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== "text/html" && !file.name.endsWith(".html")) {
            toast.error("Please upload a valid HTML bookmarks file.");
            return;
        }

        setIsImporting(true);
        try {
            const text = await file.text();
            const bookmarks = parseBookmarksHtml(text);

            if (bookmarks.length === 0) {
                toast.error("No bookmarks found in the file.");
                setIsImporting(false);
                return;
            }

            const success = await onImport(bookmarks);
            if (success) {
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            }
        } catch (error) {
            console.error("Import failed:", error);
            toast.error("Failed to parse bookmarks file.");
        } finally {
            setIsImporting(false);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleButtonClick}
                        disabled={isImporting}
                        className="shrink-0"
                    >
                        {isImporting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="h-4 w-4" />
                        )}
                        <span className="sr-only">Import Bookmarks</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Import Bookmarks (HTML)</p>
                </TooltipContent>
            </Tooltip>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html"
                className="hidden"
            />
        </TooltipProvider>
    );
}
