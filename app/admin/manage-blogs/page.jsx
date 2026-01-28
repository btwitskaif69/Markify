"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Edit,
    FileText,
    Loader2,
    MoreHorizontal,
    Plus,
    Shield,
    Trash2,
    ArrowLeft,
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
import { Separator } from "@/components/ui/separator";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import SEO from "@/components/seo/SEO";
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
        if (blogFilter === "published") return posts.filter((p) => p.published);
        if (blogFilter === "draft") return posts.filter((p) => !p.published);
        return posts;
    }, [posts, blogFilter]);

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

    return (
        <>
            <SEO title="Manage Blogs" description="Manage Markify blog posts." noindex />
            <div className="min-h-screen bg-background">
                <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card/70 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Admin Dashboard</span>
                        <Separator orientation="vertical" className="h-4" />
                        <Button size="sm" variant="ghost" asChild>
                            <Link href="/admin">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Overview
                            </Link>
                        </Button>
                        <Button size="sm" variant="default">
                            Blog
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <Link href="/admin/manage-reviews">Reviews</Link>
                        </Button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="hidden sm:inline">Signed in as</span>
                        <span className="font-medium text-foreground">{user?.email}</span>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={user ? `/dashboard/${user.id}` : "/login"}>User Dashboard</Link>
                        </Button>
                    </div>
                </header>

                <main className="p-6">
                    <section className="max-w-6xl mx-auto space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
                                    <p className="text-muted-foreground">Manage your blog posts here.</p>
                                </div>
                                <div className="flex gap-2">
                                    {selectedPosts.size > 0 && (
                                        <Button onClick={handleBulkPublish} className="mr-2">
                                            Publish Selected ({selectedPosts.size})
                                        </Button>
                                    )}
                                    <Button variant="outline" asChild>
                                        <Link href="/admin">Back to Overview</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/admin/blog/new">
                                            <Plus className="mr-2 h-4 w-4" /> Create New
                                        </Link>
                                    </Button>
                                </div>
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

                            <div className="rounded-md border bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <Checkbox
                                                    checked={filteredPosts.length > 0 && selectedPosts.size === filteredPosts.length}
                                                    onCheckedChange={handleSelectAll}
                                                />
                                            </TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isPostsLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center">
                                                    Loading...
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredPosts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center">
                                                    No {blogFilter === "all" ? "" : blogFilter} posts found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredPosts.map((post) => (
                                                <TableRow key={post.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedPosts.has(post.id)}
                                                            onCheckedChange={(checked) => handleSelectPost(post.id, checked)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">{post.title}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${post.published
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                                }`}
                                                        >
                                                            {post.published ? "Published" : "Draft"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{formatDateUTC(post.createdAt)}</TableCell>
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
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/blog/${post.slug}`}>View</Link>
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
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
