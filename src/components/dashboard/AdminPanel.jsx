import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  BarChart3,
  Users,
  Settings,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"
  }/api`;

export default function AdminPanel() {
  const { user, isAdmin, isLoading, isAuthenticated, authFetch } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [showBlogManager, setShowBlogManager] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    if (user?.geminiUsage) {
      setUsageCount(user.geminiUsage);
    }
  }, [user]);

  // Fetch latest user data to get updated usage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await authFetch(`${API_URL}/users/profile`);
        if (res.ok) {
          const data = await res.json();
          setUsageCount(data.geminiUsage || 0);
        }
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, authFetch]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  const fetchPosts = async () => {
    setIsPostsLoading(true);
    try {
      const res = await fetch(`${API_URL}/blog`);
      if (!res.ok) throw new Error("Failed to load blog posts.");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load blog posts.");
    } finally {
      setIsPostsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && showBlogManager) {
      fetchPosts();
    }
  }, [isAdmin, showBlogManager]);

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await authFetch(`${API_URL}/blog/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 204) {
        throw new Error("Failed to delete post.");
      }
      toast.success("Post deleted successfully.");
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      toast.error("Failed to delete post.");
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
    <SidebarProvider>
      <AppSidebar
        collections={[]}
        onCreateCollection={() => { }}
        onRenameCollection={() => { }}
        onDeleteCollection={() => { }}
      />
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 justify-between px-4 border-b border-border bg-card/60 backdrop-blur">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to={user ? `/dashboard/${user.id}` : "/login"}>
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink>Admin</BreadcrumbLink>
                </BreadcrumbItem>
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
            {!showBlogManager ? (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Admin Overview
                  </h1>
                  <p className="text-muted-foreground">
                    Welcome back! Here's what's happening with your site.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  {/* Analytics Card (Placeholder) */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Total Views
                      </h3>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">12,345</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +20.1% from last month
                    </p>
                  </div>

                  {/* Users Card (Placeholder) */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Active Users
                      </h3>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">573</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      +180 new users
                    </p>
                  </div>

                  {/* Blog Posts Count (Placeholder) */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Blog Posts
                      </h3>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">
                      {posts.length > 0 ? posts.length : "-"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Manage content below
                    </p>
                  </div>

                  {/* Settings Card (Placeholder) */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        System Status
                      </h3>
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-green-500">
                      Healthy
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All systems operational
                    </p>
                  </div>


                  {/* Gemini Usage Card */}
                  <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">
                        Gemini Usage
                      </h3>
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                    </div>
                    <div className="text-2xl font-bold text-indigo-600">
                      {usageCount}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      API calls made
                    </p>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid gap-4 md:grid-cols-3">
                  <div
                    className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setShowBlogManager(true)}
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
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Blog Posts
                    </h2>
                    <p className="text-muted-foreground">
                      Manage your blog posts here.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowBlogManager(false)}
                    >
                      Close Manager
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
                            <TableCell className="font-medium">
                              {post.title}
                            </TableCell>
                            <TableCell>Published</TableCell>
                            <TableCell>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/blog/${post.slug}`}>View</Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link to={`/blog/${post.slug}/edit`}>
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
            )}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider >
  );
}
