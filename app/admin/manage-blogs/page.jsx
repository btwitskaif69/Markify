"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Edit,
    Eye,
    FileText,
    Home,
    ImageIcon,
    Loader2,
    MessageSquare,
    MoreHorizontal,
    PenSquare,
    Plus,
    Search,
    Shield,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import SEO from "@/components/SEO/SEO";
import { useAuth } from "@/client/context/AuthContext";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { formatDateUTC } from "@/lib/date";

const API_URL = API_BASE_URL;

export default function BlogManagerPage() {
    const { user, isAdmin, isLoading, isAuthenticated, authFetch } = useAuth();
    const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [isPostsLoading, setIsPostsLoading] = useState(false);
    const [selectedPosts, setSelectedPosts] = useState(new Set());
    const [blogFilter, setBlogFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
            return;
        }
        if (!isLoading && isAuthenticated && !isAdmin) {
            router.replace(user ? `/dashboard/${user.id}` : "/");
        }
    }, [isLoading, isAuthenticated, isAdmin, router, user]);

    const fetchPosts = useCallback(async () => {
        setIsPostsLoading(true);
        try {
            const res = await authFetch(`${API_URL}/blog/me/list?t=${Date.now()}`);
            if (!res.ok) throw new Error("Failed to load blog posts.");
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            toast.error("Failed to load blog posts.");
        } finally {
            setIsPostsLoading(false);
        }
    }, [authFetch]);

    useEffect(() => {
        if (isAdmin) {
            fetchPosts();
        }
    }, [isAdmin, fetchPosts]);

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await authFetch(`${API_URL}/blog/${postId}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error("Failed to delete post.");
            toast.success("Post deleted successfully.");
            setPosts((prev) => prev.filter((post) => post.id !== postId));
        } catch (err) {
            toast.error("Failed to delete post.");
        }
    };

    const filteredPosts = useMemo(() => {
        let result = posts;
        if (blogFilter === "published") result = result.filter((p) => p.published);
        if (blogFilter === "draft") result = result.filter((p) => !p.published);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
        }
        return result;
    }, [posts, blogFilter, searchQuery]);

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedPosts(new Set(filteredPosts.map((p) => p.id)));
        } else {
            setSelectedPosts(new Set());
        }
    };

    const handleSelectPost = (postId, checked) => {
        const newSelected = new Set(selectedPosts);
        if (checked) {
            newSelected.add(postId);
        } else {
            newSelected.delete(postId);
        }
        setSelectedPosts(newSelected);
    };

    const handleBulkPublish = async () => {
        if (selectedPosts.size === 0) return;
        if (!window.confirm(`Are you sure you want to publish ${selectedPosts.size} posts?`)) return;

        try {
            const res = await authFetch(`${API_URL}/blog/bulk`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ids: Array.from(selectedPosts),
                    data: { published: true },
                }),
            });

            if (!res.ok) throw new Error("Failed to bulk publish.");

            toast.success("Posts published successfully.");

            setPosts(prev => prev.map(p => selectedPosts.has(p.id) ? { ...p, published: true } : p));
            setSelectedPosts(new Set());
        } catch (err) {
            toast.error("Failed to bulk publish posts.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const sidebarLinks = [
        { href: "/admin", label: "Overview", icon: Home },
        { href: "/admin/manage-blogs", label: "Blog", icon: FileText, active: true },
        { href: "/admin?view=reviews", label: "Reviews", icon: MessageSquare },
    ];

    return (
        <>
            <SEO title="Manage Blogs" description="Manage Markify blog posts." noindex />
            <div className="min-h-screen bg-background flex">
                {/* Sidebar */}
                <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm sticky top-0 h-screen">
                    <div className="flex h-16 items-center gap-3 px-6 border-b border-border">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Admin</span>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${link.active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    }`}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="p-4 border-t border-border">
                        <Button className="w-full" asChild>
                            <Link href="/admin/blog/new">
                                <PenSquare className="mr-2 h-4 w-4" /> New Post
                            </Link>
                        </Button>
                        <div className="mt-4 text-xs text-muted-foreground">
                            <p>Signed in as</p>
                            <p className="font-medium text-foreground truncate">{user?.email}</p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                            <Link href={user ? `/dashboard/${user.id}` : "/login"}>User Dashboard</Link>
                        </Button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card/70 backdrop-blur">
                        <div>
                            <h2 className="text-lg font-semibold">Blog Posts</h2>
                            <p className="text-xs text-muted-foreground">Manage your blog posts here</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedPosts.size > 0 && (
                                <Button size="sm" onClick={handleBulkPublish}>
                                    Publish Selected ({selectedPosts.size})
                                </Button>
                            )}
                            <Button size="sm" asChild className="md:hidden">
                                <Link href="/admin/blog/new">
                                    <Plus className="mr-2 h-4 w-4" /> New
                                </Link>
                            </Button>
                        </div>
                    </header>

                    <main className="flex-1 p-6">
                        <div className="space-y-4">
                            {/* Search + Filters Row */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search blog posts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Filter Tabs */}
                                <div className="flex items-center gap-1 p-1 bg-muted rounded-lg w-fit">
                                    <button
                                        onClick={() => { setBlogFilter("all"); setSelectedPosts(new Set()); }}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${blogFilter === "all"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        All ({posts.length})
                                    </button>
                                    <button
                                        onClick={() => { setBlogFilter("published"); setSelectedPosts(new Set()); }}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${blogFilter === "published"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        Published ({posts.filter((p) => p.published).length})
                                    </button>
                                    <button
                                        onClick={() => { setBlogFilter("draft"); setSelectedPosts(new Set()); }}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${blogFilter === "draft"
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        Drafts ({posts.filter((p) => !p.published).length})
                                    </button>
                                </div>
                            </div>

                            {isPostsLoading ? (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="rounded-xl border border-border bg-card animate-pulse">
                                            <div className="aspect-video bg-muted rounded-t-xl" />
                                            <div className="p-4 space-y-3">
                                                <div className="h-4 bg-muted rounded w-3/4" />
                                                <div className="h-3 bg-muted rounded w-full" />
                                                <div className="h-3 bg-muted rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
                                    <p className="text-muted-foreground">
                                        No {blogFilter === "all" ? "" : blogFilter} posts found.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* Select All */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <Checkbox
                                            checked={filteredPosts.length > 0 && selectedPosts.size === filteredPosts.length}
                                            onCheckedChange={handleSelectAll}
                                        />
                                        <span className="text-sm text-muted-foreground">Select all</span>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                        {filteredPosts.map((post) => (
                                            <div
                                                key={post.id}
                                                className={`group relative rounded-xl border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 ${selectedPosts.has(post.id) ? "ring-2 ring-primary border-primary/60" : "border-border/60"}`}
                                            >
                                                {/* Checkbox */}
                                                <div className="absolute top-3 left-3 z-10">
                                                    <Checkbox
                                                        checked={selectedPosts.has(post.id)}
                                                        onCheckedChange={(checked) => handleSelectPost(post.id, checked)}
                                                        className="bg-background/80 backdrop-blur-sm"
                                                    />
                                                </div>

                                                {/* Actions Dropdown */}
                                                <div className="absolute top-3 right-3 z-10">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/blog/${post.slug}`}>
                                                                    <Eye className="mr-2 h-4 w-4" /> View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/blog/${post.slug}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleDelete(post.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {/* Cover Image */}
                                                <div className="aspect-video overflow-hidden bg-muted">
                                                    {post.coverImage ? (
                                                        <img
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-muted-foreground/40">
                                                            <ImageIcon className="h-10 w-10" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Card Content */}
                                                <div className="p-4 space-y-3">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published
                                                                ? "bg-green-500/10 text-green-500"
                                                                : "bg-yellow-500/10 text-yellow-500"
                                                                }`}
                                                        >
                                                            {post.published ? "Published" : "Draft"}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{formatDateUTC(post.createdAt)}</span>
                                                    </div>
                                                    <h3 className="font-semibold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    {post.excerpt && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
