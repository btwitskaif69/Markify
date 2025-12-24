import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BarChart3,
  BookMarked,
  CheckCircle,
  Edit,
  FileText,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Sparkles,
  Star,
  Trash2,
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
import { Input } from "@/components/ui/input";
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
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import BookmarkManager from "@/components/dashboard/BookmarkManager";

import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/apiConfig";

const API_URL = API_BASE_URL;

export default function AdminPanel() {
  const { user, isAdmin, isLoading, isAuthenticated, authFetch } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // View States
  const [activeView, setActiveView] = useState("overview"); // 'overview', 'blog', 'reviews', 'bookmarks'

  const [usageCount, setUsageCount] = useState(0);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [isPendingLoading, setIsPendingLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    } else if (!isLoading && !isAdmin) {
      navigate(`/dashboard/${user?.id}`);
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate, user]);

  useEffect(() => {
    // Fetch usage count (mock or actual)
    setUsageCount(Math.floor(Math.random() * 100)); // Placeholder
  }, []);

  useEffect(() => {
    if (isAdmin) {
      // Fetch pending reviews count
      const fetchCount = async () => {
        try {
          const res = await authFetch(`${API_URL}/reviews/pending`);
          if (res.ok) {
            const data = await res.json();
            setPendingCount(data.length);
          }
        } catch (e) { console.error(e); }
      };
      fetchCount();
    }
  }, [isAdmin]);


  // Fetch Logic (Simplified for brevity, kept existing logic)
  const fetchPosts = async () => {
    setIsPostsLoading(true);
    try {
      const res = await authFetch(`${API_URL}/blog/me/list`);
      if (!res.ok) throw new Error("Failed to load blog posts.");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load blog posts.");
    } finally {
      setIsPostsLoading(false);
    }
  };

  const fetchPendingReviews = async () => {
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
  };

  useEffect(() => {
    if (isAdmin) {
      if (activeView === 'blog') fetchPosts();
      if (activeView === 'reviews') fetchPendingReviews();
    }
  }, [isAdmin, activeView]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await authFetch(`${API_URL}/blog/${postId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete post.");
      toast.success("Post deleted successfully.");
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      toast.error("Failed to delete post.");
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      const res = await authFetch(`${API_URL}/reviews/${reviewId}/approve`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to approve review.");
      toast.success("Review approved successfully.");
      setPendingReviews(pendingReviews.filter((r) => r.id !== reviewId));
      setPendingCount((prev) => Math.max(0, prev - 1));
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
      setPendingReviews(pendingReviews.filter((r) => r.id !== reviewId));
      setPendingCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error("Failed to reject review.");
    }
  };

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
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your site.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Total Views</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12,345</div>
          <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Active Users</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">573</div>
          <p className="text-xs text-muted-foreground mt-1">+180 new users</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Pending Reviews</h3>
            <MessageSquare className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-muted-foreground">Gemini Usage</h3>
            <Sparkles className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{usageCount}</div>
          <p className="text-xs text-muted-foreground mt-1">API calls made</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Blog Manager Card */}
        <div
          className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          onClick={() => setActiveView("blog")}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <h3 className="font-semibold mb-1">Manage Blog</h3>
            <p className="text-sm text-muted-foreground">Create, edit, and delete blog posts.</p>
          </div>
        </div>

        {/* Review Manager Card */}
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
              {pendingCount > 0 && (
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Approve or reject user reviews.</p>
          </div>
        </div>

        {/* Bookmark Manager Card - NEW */}
        <div
          className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          onClick={() => setActiveView("bookmarks")}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookMarked className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <h3 className="font-semibold mb-1">Bookmarks</h3>
            <p className="text-sm text-muted-foreground">Manage your bookmarks collection.</p>
          </div>
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
            <Link to="/blog/new">
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
              <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : posts.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="h-24 text-center">No posts found.</TableCell></TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild><Link to={`/blog/${post.slug}`}>View</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link to={`/blog/${post.slug}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(post.id)}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
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
          <p className="text-muted-foreground">Approve or reject user reviews before they appear on the site.</p>
        </div>
        <Button variant="outline" onClick={() => setActiveView("overview")}>Back to Overview</Button>
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
              <TableRow><TableCell colSpan={5} className="h-24 text-center">Loading...</TableCell></TableRow>
            ) : pendingReviews.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="h-24 text-center">No pending reviews.</TableCell></TableRow>
            ) : (
              pendingReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img src={review.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name || 'User')}&background=random`} alt={review.user?.name} className="h-8 w-8 rounded-full object-cover" />
                      <div><div className="font-medium">{review.user?.name}</div><div className="text-xs text-muted-foreground">{review.user?.email}</div></div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md"><p className="line-clamp-2 text-sm">{review.content}</p></TableCell>
                  <TableCell>{new Date(review.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleApproveReview(review.id)}><CheckCircle className="h-4 w-4 mr-1" /> Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleRejectReview(review.id)}><XCircle className="h-4 w-4 mr-1" /> Reject</Button>
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
      <SEO
        title="Admin panel"
        description="Review and manage Markify content."
        noindex
      />
      <SidebarProvider>
        <AppSidebar collections={[]} onCreateCollection={() => { }} onRenameCollection={() => { }} onDeleteCollection={() => { }} />
        <SidebarInset className="flex flex-col min-h-screen bg-background">
          <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4 border-b border-border bg-card/60 backdrop-blur">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink asChild><Link to={user ? `/dashboard/${user.id}` : "/login"}>Dashboard</Link></BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem><BreadcrumbLink>Admin</BreadcrumbLink></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="hidden sm:inline">Signed in as</span>
              <span className="font-medium text-foreground">{user?.email}</span>
            </div>
          </header>

          <main className="flex-1 p-6">
            <section className="max-w-6xl mx-auto space-y-6">
              {activeView === 'overview' && renderOverview()}
              {activeView === 'blog' && renderBlogManager()}
              {activeView === 'reviews' && renderReviewManager()}
              {activeView === 'bookmarks' && <BookmarkManager onClose={() => setActiveView("overview")} />}
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
