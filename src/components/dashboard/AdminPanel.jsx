import { useEffect } from "react";
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
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AdminPanel() {
  const { user, isAdmin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        collections={[]}
        onCreateCollection={() => {}}
        onRenameCollection={() => {}}
        onDeleteCollection={() => {}}
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
          <section className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage admin-only features like blog posts.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h2 className="font-semibold mb-1">Blog posts</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create and manage public blog posts.
                  </p>
                </div>
                <Button asChild className="w-full">
                  <Link to="/blog/new">Create blog post</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
