import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Calendar, User, Clock } from "lucide-react";
import { API_BASE_URL } from "@/lib/apiConfig";
import { secureFetch } from "@/lib/secureApi";
import SEO from "../SEO/SEO";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  getCanonicalUrl,
} from "@/lib/seo";

const API_URL = API_BASE_URL;

// Helper function to render markdown-like content
const renderContent = (content) => {
  if (!content) return { __html: "" };

  let html = content
    // Escape HTML first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold mt-8 mb-4">$1</h1>')
    // Bold and Italic
    .replace(/\*\*\*(.*?)\*\*\*/gim, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/__(.*?)__/gim, '<strong>$1</strong>')
    .replace(/_(.*?)_/gim, '<em>$1</em>')
    .replace(/~~(.*?)~~/gim, '<del>$1</del>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-muted p-4 rounded-md my-4 overflow-x-auto"><code>$1</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Blockquotes
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1 my-4 italic text-muted-foreground">$1</blockquote>')
    // Unordered lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
    // Ordered lists (handle basic digits)
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
    // Horizontal rule
    .replace(/^---$/gim, "<hr class='my-6 border-border' />")
    // Paragraphs (double newlines)
    .replace(/\n\n/gim, '<br/><br/>')
    // Single newlines
    .replace(/\n/gim, '<br/>');

  // Wrap in paragraph
  html = `<p>${html}</p>`;

  // Fix consecutive list items
  html = html.replace(/<\/li><br \/><li>/g, "</li><li>");
  html = html.replace(/<li>/g, "<ul><li>").replace(/<\/li>(?!<li>)/g, "</li></ul>");
  html = html.replace(/<\/ul><ul>/g, "");

  return { __html: html };
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(Math.min(progress, 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch current post
        const postRes = await secureFetch(`${API_URL}/blog/${slug}`);
        if (postRes.status === 404) {
          throw new Error("Post not found.");
        }
        if (!postRes.ok) throw new Error("Failed to load post.");
        const postData = await postRes.json();
        setPost(postData);

        // Fetch latest posts for sidebar
        const postsRes = await secureFetch(`${API_URL}/blog`);
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

  const renderedContent = useMemo(
    () => renderContent(post?.content),
    [post?.content]
  );

  // Construct structured data if post exists
  const structuredData = useMemo(() => {
    if (!post) return null;
    const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);
    const articleSchema = buildArticleSchema({
      title: post.title,
      description: post.excerpt,
      image: post.coverImage,
      url: canonicalUrl,
      datePublished: post.createdAt,
      dateModified: post.updatedAt || post.createdAt,
      authorName: post.author?.name || "Markify Team",
    });
    const breadcrumbs = buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]);
    return [articleSchema, breadcrumbs].filter(Boolean);
  }, [post]);

  return (
    <>
      <Navbar />

      {post && (
        <SEO
          title={post.title}
          description={post.excerpt || `Read ${post.title} on Markify Blog.`}
          canonical={getCanonicalUrl(`/blog/${post.slug}`)}
          type="article"
          image={post.coverImage}
          imageAlt={post.title}
          publishedTime={post.createdAt}
          modifiedTime={post.updatedAt || post.createdAt}
          author={post.author?.name || "Markify Team"}
          structuredData={structuredData}
        />
      )}

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
            <header className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-muted overflow-hidden">
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
            </header>

            {/* Content & Sidebar Section */}
            <div className="container mx-auto px-4 mt-12">
              <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
                {/* Main Content */}
                <div className="min-w-0">
                  <div
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={renderedContent}
                  />

                  <hr className="my-12 border-border" />

                  <div className="flex flex-col gap-6">
                    <div className="flex justify-between items-center">
                      <p className="text-muted-foreground italic">
                        Thanks for reading!
                      </p>
                      <Button asChild variant="outline">
                        <Link to="/blog">Read more articles</Link>
                      </Button>
                    </div>

                    <div className="p-6 rounded-xl border border-border bg-card/50">
                      <h3 className="text-lg font-semibold mb-3">Explore More</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Discover how Markify can transform your workflow:
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <Link to="/about" className="text-primary hover:underline">
                          About Markify
                        </Link>
                        <span className="text-muted-foreground" aria-hidden="true">|</span>
                        <Link to="/solutions" className="text-primary hover:underline">
                          Browse Solutions
                        </Link>
                        <span className="text-muted-foreground" aria-hidden="true">|</span>
                        <Link to="/features" className="text-primary hover:underline">
                          Explore Features
                        </Link>
                        <span className="text-muted-foreground" aria-hidden="true">|</span>
                        <Link to="/pricing" className="text-primary hover:underline">
                          View Pricing
                        </Link>
                        <span className="text-muted-foreground" aria-hidden="true">|</span>
                        <Link to="/signup" className="text-primary hover:underline">
                          Sign Up Free
                        </Link>
                        <span className="text-muted-foreground" aria-hidden="true">|</span>
                        <Link to="/contact" className="text-primary hover:underline">
                          Contact Us
                        </Link>
                      </div>
                    </div>
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
