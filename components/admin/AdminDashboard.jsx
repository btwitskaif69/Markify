"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Edit,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Shield,
  Star,
  Trash2,
  UserPlus,
  Users,
  XCircle,
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
import SEO from "@/components/SEO/SEO";
import { useAuth } from "@/client/context/AuthContext";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { formatDateUTC } from "@/lib/date";

const API_URL = API_BASE_URL;

const StatCard = ({ title, value, icon: Icon, accent, helper }) => (
  <div className="rounded-xl border bg-card p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-sm text-muted-foreground">{title}</h3>
      <Icon className={`h-4 w-4 ${accent || "text-muted-foreground"}`} />
    </div>
    <div className={`text-2xl font-bold ${accent || ""}`}>{value}</div>
    {helper ? <p className="text-xs text-muted-foreground mt-1">{helper}</p> : null}
  </div>
);

export default function AdminDashboard() {
  const { user, isAdmin, isLoading, isAuthenticated, authFetch } = useAuth();
  const router = useRouter();

  const [activeView, setActiveView] = useState("overview");
  const [overview, setOverview] = useState(null);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);

  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  const [pendingReviews, setPendingReviews] = useState([]);
  const [isPendingLoading, setIsPendingLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.replace(user ? `/dashboard/${user.id}` : "/");
    }
  }, [isLoading, isAuthenticated, isAdmin, router, user]);

  const fetchOverview = useCallback(async () => {
    setIsOverviewLoading(true);
    try {
      const res = await authFetch(`${API_URL}/admin/overview`);
      if (!res.ok) throw new Error("Failed to load admin overview.");
      const data = await res.json();
      setOverview(data);
    } catch (err) {
      toast.error("Failed to load admin overview.");
    } finally {
      setIsOverviewLoading(false);
    }
  }, [authFetch]);

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

  const fetchPendingReviews = useCallback(async () => {
    setIsPendingLoading(true);
    try {
      const res = await authFetch(`${API_URL}/reviews/pending`);
      if (!res.ok) throw new Error("Failed to load pending reviews.");
      const data = await res.json();
      setPendingReviews(data);
    } catch (err) {
      toast.error("Failed to load pending reviews.");
    } finally {
      setIsPendingLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (isAdmin) {
      fetchOverview();
    }
  }, [isAdmin, fetchOverview]);

  useEffect(() => {
    if (!isAdmin) return;
    if (activeView === "blog") fetchPosts();
    if (activeView === "reviews") fetchPendingReviews();
  }, [activeView, fetchPosts, fetchPendingReviews, isAdmin]);

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

  const handleApproveReview = async (reviewId) => {
    try {
      const res = await authFetch(`${API_URL}/reviews/${reviewId}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to approve review.");
      toast.success("Review approved successfully.");
      setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              moderation: {
                ...prev.moderation,
                pendingReviews: Math.max(0, (prev.moderation?.pendingReviews ?? 0) - 1),
              },
            }
          : prev
      );
    } catch (err) {
      toast.error("Failed to approve review.");
    }
  };

  const handleRejectReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to reject this review?")) return;
    try {
      const res = await authFetch(`${API_URL}/reviews/${reviewId}/reject`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to reject review.");
      toast.success("Review rejected.");
      setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setOverview((prev) =>
        prev
          ? {
              ...prev,
              moderation: {
                ...prev.moderation,
                pendingReviews: Math.max(0, (prev.moderation?.pendingReviews ?? 0) - 1),
              },
            }
          : prev
      );
    } catch (err) {
      toast.error("Failed to reject review.");
    }
  };

  const stats = useMemo(() => {
    const totals = overview?.totals || {};
    const activity = overview?.activity || {};
    const moderation = overview?.moderation || {};
    return {
      totalUsers: totals.users ?? 0,
      totalPosts: totals.posts ?? 0,
      newUsers24h: activity.newUsers24h ?? 0,
      newUsers7d: activity.newUsers7d ?? 0,
      logins24h: activity.logins24h ?? 0,
      logins7d: activity.logins7d ?? 0,
      pendingReviews: moderation.pendingReviews ?? 0,
    };
  }, [overview]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderOverview = () => (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">
          Monitor signups, logins, and pending content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Users"
          value={isOverviewLoading ? "..." : stats.totalUsers}
          icon={Users}
        />
        <StatCard
          title="New Accounts (24h)"
          value={isOverviewLoading ? "..." : stats.newUsers24h}
          helper={`Last 7d: ${stats.newUsers7d}`}
          icon={UserPlus}
        />
        <StatCard
          title="Logins (24h)"
          value={isOverviewLoading ? "..." : stats.logins24h}
          helper={`Last 7d: ${stats.logins7d}`}
          icon={Shield}
        />
        <StatCard
          title="Pending Reviews"
          value={isOverviewLoading ? "..." : stats.pendingReviews}
          icon={MessageSquare}
          accent="text-orange-600"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <div
          className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          onClick={() => setActiveView("blog")}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <h3 className="font-semibold mb-1">Manage Blog</h3>
            <p className="text-sm text-muted-foreground">
              Create, edit, and delete blog posts.
            </p>
          </div>
        </div>

        <div
          className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          onClick={() => setActiveView("reviews")}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <MessageSquare className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">Manage Reviews</h3>
              {stats.pendingReviews > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingReviews}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Approve or reject user reviews.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Blog Posts</h3>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">{isOverviewLoading ? "..." : stats.totalPosts}</div>
          <p className="text-xs text-muted-foreground mt-1">Published & draft</p>
        </div>
      </div>
    </div>
  );

  const renderBlogManager = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your blog posts here.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setActiveView("overview")}>
            Back to Overview
          </Button>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="mr-2 h-4 w-4" /> Create New
            </Link>
          </Button>
        </div>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPostsLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.published
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
  );

  const renderReviewManager = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pending Reviews</h2>
          <p className="text-muted-foreground">
            Approve or reject user reviews before they appear on the site.
          </p>
        </div>
        <Button variant="outline" onClick={() => setActiveView("overview")}>
          Back to Overview
        </Button>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="max-w-md">Review</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPendingLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : pendingReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No pending reviews.
                </TableCell>
              </TableRow>
            ) : (
              pendingReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          review.user?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            review.user?.name || "User"
                          )}&background=random`
                        }
                        alt={review.user?.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        decoding="async"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{review.user?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {review.user?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="line-clamp-2 text-sm">{review.content}</p>
                  </TableCell>
                  <TableCell>{formatDateUTC(review.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApproveReview(review.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRejectReview(review.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <>
      <SEO title="Admin dashboard" description="Manage Markify content." noindex />
      <div className="min-h-screen bg-background">
        <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card/70 backdrop-blur">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">Admin Dashboard</span>
            <Separator orientation="vertical" className="h-4" />
            <Button
              size="sm"
              variant={activeView === "overview" ? "default" : "ghost"}
              onClick={() => setActiveView("overview")}
            >
              Overview
            </Button>
            <Button
              size="sm"
              variant={activeView === "blog" ? "default" : "ghost"}
              onClick={() => setActiveView("blog")}
            >
              Blog
            </Button>
            <Button
              size="sm"
              variant={activeView === "reviews" ? "default" : "ghost"}
              onClick={() => setActiveView("reviews")}
            >
              Reviews
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
            {activeView === "overview" && renderOverview()}
            {activeView === "blog" && renderBlogManager()}
            {activeView === "reviews" && renderReviewManager()}
          </section>
        </main>
      </div>
    </>
  );
}
