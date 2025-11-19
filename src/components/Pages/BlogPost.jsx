import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, ArrowLeft, Calendar, User, Clock } from "lucide-react";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"
  }/api`;

const escapeHtml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const formatLine = (line) => {
  let html = escapeHtml(line);

  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline hover:text-primary/80">$1</a>'
  );

  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__([^_]+)__/g, "<u>$1</u>");
  html = html.replace(/(^|[\s])_([^_]+)_/g, "$1<em>$2</em>");

  return html;
};

const renderContent = (content) => {
  if (!content) return { __html: "" };
  const lines = content.split(/\r?\n/);
  const html = lines
    .map((line) =>
      line.trim()
        ? `<p class="mb-4 leading-relaxed text-lg text-muted-foreground">${formatLine(line)}</p>`
        : "<p class='h-4'>&nbsp;</p>"
    )
    .join("");
  return { __html: html };
};

const BlogPost = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch current post
        const postRes = await fetch(`${API_URL}/blog/${slug}`);
        if (postRes.status === 404) {
          throw new Error("Post not found.");
        }
        if (!postRes.ok) throw new Error("Failed to load post.");
        const postData = await postRes.json();
        setPost(postData);

        // Fetch latest posts for sidebar
        const postsRes = await fetch(`${API_URL}/blog`);
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          // Filter out current post and take top 3
          setLatestPosts(
            postsData.filter((p) => p.id !== postData.id).slice(0, 3)
          );
        }
      } catch (err) {
        setError(err.message || "Failed to load content.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <>
      <Navbar />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      <main className="bg-background text-foreground min-h-screen pb-20 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]"></div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-[50vh] relative z-10">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {error && !isLoading && (
          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Button asChild variant="outline">
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </div>
        )}
        {!isLoading && !error && post && (
          <article className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-muted overflow-hidden">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/10 to-background flex items-center justify-center">
                  <span className="text-muted-foreground text-xl">
                    No Cover Image
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10 md:pb-16">
                <div className="max-w-5xl mx-auto">
                  <Link
                    to="/blog"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Link>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{post.author?.name || "Markify Team"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content & Sidebar Section */}
            <div className="container mx-auto px-4 mt-12">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
                {/* Main Content */}
                <div className="min-w-0">
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={renderContent(post.content)}
                  />

                  <hr className="my-12 border-border" />

                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground italic">
                      Thanks for reading!
                    </p>
                    <Button asChild variant="outline">
                      <Link to="/blog">Read more articles</Link>
                    </Button>
                  </div>
                </div>

                {/* Sidebar */}
                <aside className="hidden lg:block space-y-8">
                  {/* Latest Posts Widget */}
                  <div className="sticky top-32">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Latest Posts
                    </h3>
                    <div className="space-y-4">
                      {latestPosts.length > 0 ? (
                        latestPosts.map((latest) => (
                          <Link key={latest.id} to={`/blog/${latest.slug}`} className="block group">
                            <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm !py-0">
                              <div className="aspect-video w-full bg-muted overflow-hidden">
                                {latest.coverImage ? (
                                  <img
                                    src={latest.coverImage}
                                    alt={latest.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                    No Image
                                  </div>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors text-sm mb-2">
                                  {latest.title}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(
                                    latest.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </CardContent>
                            </Card>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No other posts available.</p>
                      )}
                    </div>
                  </div>
                </aside>

                {/* Mobile "Latest Posts" (visible only on small screens) */}
                <div className="lg:hidden mt-8">
                  <h3 className="text-xl font-semibold mb-6">More to Read</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {latestPosts.map((latest) => (
                      <Link
                        key={latest.id}
                        to={`/blog/${latest.slug}`}
                        className="block group"
                      >
                        <Card className="overflow-hidden border-border/50 hover:border-primary/30 transition-colors !py-0">
                          <div className="aspect-video w-full bg-muted overflow-hidden">
                            {latest.coverImage ? (
                              <img
                                src={latest.coverImage}
                                alt={latest.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors mb-2">
                              {latest.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(latest.createdAt).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
