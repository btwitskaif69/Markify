import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    MoreHorizontal,
    Edit,
    Trash2,
    ExternalLink,
    Search,
    Sparkles,
    Loader2,
    Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

export default function BookmarkManager({ onClose }) {
    const { authFetch, user } = useAuth();
    const [bookmarks, setBookmarks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog States
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState(null);

    // Form States
    const [formData, setFormData] = useState({
        title: "",
        url: "",
        description: "",
        category: "",
        tags: "",
        previewImage: "",
    });
    const [isExtracting, setIsExtracting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        setIsLoading(true);
        try {
            const res = await authFetch(`${API_URL}/bookmarks/user/${user.id}`);
            if (!res.ok) throw new Error("Failed to load bookmarks");
            const data = await res.json();
            setBookmarks(data);
        } catch (error) {
            toast.error("Failed to load bookmarks");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExtractMetadata = async () => {
        if (!formData.url) return toast.error("Please enter a URL first");

        setIsExtracting(true);
        try {
            const res = await authFetch(`${API_URL}/bookmarks/extract-metadata`, {
                method: "POST",
                body: JSON.stringify({ url: formData.url }),
            });

            const result = await res.json();

            if (!res.ok) throw new Error(result.message || "Extraction failed");

            if (result.success && result.data) {
                setFormData(prev => ({
                    ...prev,
                    title: result.data.title || prev.title,
                    description: result.data.description || prev.description,
                    previewImage: result.data.image || prev.previewImage,
                    tags: result.data.tags || prev.tags,
                }));
                toast.success("Metadata extracted!");
            }
        } catch (error) {
            toast.error(error.message || "Failed to extract metadata");
        } finally {
            setIsExtracting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const url = editingBookmark
                ? `${API_URL}/bookmarks/${editingBookmark.id}`
                : `${API_URL}/bookmarks/user/${user.id}`;

            const method = editingBookmark ? "PATCH" : "POST";

            const res = await authFetch(url, {
                method,
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save bookmark");

            toast.success(editingBookmark ? "Bookmark updated" : "Bookmark created");
            setIsDialogOpen(false);
            fetchBookmarks();
            resetForm();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await authFetch(`${API_URL}/bookmarks/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete");
            toast.success("Bookmark deleted");
            setBookmarks(prev => prev.filter(b => b.id !== id));
        } catch (error) {
            toast.error("Failed to delete bookmark");
        }
    };

    const startEdit = (bookmark) => {
        setEditingBookmark(bookmark);
        setFormData({
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description || "",
            category: bookmark.category || "",
            tags: bookmark.tags || "",
            previewImage: bookmark.previewImage || "",
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingBookmark(null);
        setFormData({
            title: "",
            url: "",
            description: "",
            category: "",
            tags: "",
            previewImage: "",
        });
    };

    const filteredBookmarks = bookmarks.filter(b =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Bookmark Manager</h2>
                    <p className="text-muted-foreground">Manage your bookmarks collection.</p>
                </div>
                <div className="flex gap-2">
                    {onClose && (
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Add Bookmark
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}</DialogTitle>
                                <DialogDescription>
                                    Enter the URL and click Auto-fill to fetch details automatically.
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4 py-2">
                                <div className="space-y-2">
                                    <Label>URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://example.com"
                                            value={formData.url}
                                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleExtractMetadata}
                                            disabled={isExtracting || !formData.url}
                                        >
                                            {isExtracting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                                            <span className="sr-only">Auto-fill</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        placeholder="Bookmark Title"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Brief description..."
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="resize-none"
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input
                                            placeholder="e.g. Reference"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tags</Label>
                                        <Input
                                            placeholder="tech, news..."
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Preview Image URL</Label>
                                    <Input
                                        placeholder="https://..."
                                        value={formData.previewImage}
                                        onChange={e => setFormData({ ...formData, previewImage: e.target.value })}
                                    />
                                    {formData.previewImage && (
                                        <div className="mt-2 relative rounded-md overflow-hidden aspect-video border bg-muted">
                                            <img
                                                src={formData.previewImage}
                                                alt="Preview"
                                                width={640}
                                                height={360}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {editingBookmark ? "Save Changes" : "Create Bookmark"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search bookmarks..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title & URL</TableHead>
                            <TableHead className="hidden md:table-cell">Category</TableHead>
                            <TableHead className="hidden md:table-cell">Tags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                </TableCell>
                            </TableRow>
                        ) : filteredBookmarks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No bookmarks found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookmarks.map((bookmark) => (
                                <TableRow key={bookmark.id}>
                                    <TableCell>
                                        <div className="h-10 w-16 rounded overflow-hidden bg-muted">
                                            {bookmark.previewImage ? (
                                                <img
                                                    src={bookmark.previewImage}
                                                    alt=""
                                                    width={64}
                                                    height={40}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.classList.add('flex', 'items-center', 'justify-center'); }}
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                                    <ImageIcon className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium line-clamp-1" title={bookmark.title}>{bookmark.title}</div>
                                        <a
                                            href={bookmark.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-muted-foreground hover:underline line-clamp-1 flex items-center gap-1"
                                        >
                                            {bookmark.url} <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {bookmark.category && (
                                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                {bookmark.category}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {bookmark.tags && bookmark.tags.split(',').slice(0, 2).map((tag, i) => (
                                                <span key={i} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => window.open(bookmark.url, '_blank')}>
                                                    View Site
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => startEdit(bookmark)}>
                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => handleDelete(bookmark.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
