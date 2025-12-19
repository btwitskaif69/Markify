import { useState } from "react";
import { Copy, Check, Share2, Link2, Globe, Lock } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

/**
 * ShareDialog - A dialog component for sharing bookmarks or collections.
 * @param {boolean} open - Whether the dialog is open
 * @param {function} setOpen - Function to set dialog open state
 * @param {object} item - The bookmark or collection object to share
 * @param {"bookmark" | "collection"} type - Type of item being shared
 * @param {function} authFetch - Authenticated fetch function
 * @param {function} onShareToggle - Callback when share status changes (receives updated item)
 */
export default function ShareDialog({
    open,
    setOpen,
    item,
    type = "bookmark",
    authFetch,
    onShareToggle,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const isShared = !!item?.shareId;
    const shareUrl = item?.shareId
        ? `${window.location.origin}/shared/${type}/${item.shareId}`
        : null;

    const handleToggleShare = async () => {
        if (!item) return;
        setIsLoading(true);

        try {
            const endpoint =
                type === "bookmark"
                    ? `${API_URL}/bookmarks/${item.id}/share`
                    : `${API_URL}/collections/${item.id}/share`;

            const response = await authFetch(endpoint, {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("Failed to toggle sharing");
            }

            const data = await response.json();

            // Call the callback with the updated item
            if (type === "bookmark") {
                onShareToggle?.(data.bookmark);
            } else {
                onShareToggle?.(data.collection);
            }

            toast.success(data.shareId ? "Sharing enabled!" : "Sharing disabled!");
        } catch (error) {
            console.error("Error toggling share:", error);
            toast.error("Failed to toggle sharing");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyLink = async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy:", error);
            toast.error("Failed to copy link");
        }
    };

    const itemName = type === "bookmark" ? item?.title : item?.name;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share {type === "bookmark" ? "Bookmark" : "Collection"}
                    </DialogTitle>
                    <DialogDescription className="line-clamp-1">
                        {itemName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Share Toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            {isShared ? (
                                <Globe className="h-5 w-5 text-green-500" />
                            ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                                <Label htmlFor="share-toggle" className="text-base font-medium">
                                    {isShared ? "Public" : "Private"}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {isShared
                                        ? "Anyone with the link can view"
                                        : "Only you can access"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="share-toggle"
                            checked={isShared}
                            onCheckedChange={handleToggleShare}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Share Link */}
                    {isShared && shareUrl && (
                        <div className="space-y-2">
                            <Label htmlFor="share-link">Share Link</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="share-link"
                                        value={shareUrl}
                                        readOnly
                                        className="pl-10 pr-4"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    onClick={handleCopyLink}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Share this link with anyone you want to give access.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
