import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const API_URL = `${
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"
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
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
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
        ? `<p>${formatLine(line)}</p>`
        : "<p>&nbsp;</p>"
    )
    .join("");
  return { __html: html };
};

const BlogPost = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${API_URL}/blog/${slug}`);
        if (res.status === 404) {
          setError("Post not found.");
          setIsLoading(false);
          return;
        }
        if (!res.ok) throw new Error("Failed to load post.");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message || "Failed to load post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground">
        <section className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
          {isLoading && (
            <p className="text-center text-muted-foreground">Loading...</p>
          )}
          {error && !isLoading && (
            <p className="text-center text-destructive">{error}</p>
          )}
          {!isLoading && !error && post && (
            <>
              <div className="mb-8">
                <p className="text-xs text-muted-foreground mb-3">
                  <Link to="/blog" className="hover:underline">
                    &larr; Back to blog
                  </Link>
                </p>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                  {post.title}
                </h1>
                <p className="text-xs text-muted-foreground mb-2">
                  {post.author?.name ? `By ${post.author.name} • ` : ""}
                  {post.createdAt
                    ? new Date(post.createdAt).toLocaleDateString()
                    : ""}
                </p>
                {user && post.authorId === user.id && (
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/blog/${post.slug}/edit`}>Edit post</Link>
                  </Button>
                )}
              </div>
              {post.coverImage && (
                <div className="mb-6">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full rounded-xl object-cover"
                  />
                </div>
              )}
              <article
                className="prose prose-slate dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={renderContent(post.content)}
              />
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default BlogPost;
