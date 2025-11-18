import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const API_URL = `${
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"
}/api`;

const Blog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/blog`);
        if (!res.ok) throw new Error("Failed to load blog posts.");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message || "Failed to load blog posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-muted-foreground mb-6">
              Tips, updates, and ideas on building better workflows and managing
              your knowledge with Markify.
            </p>

            {user && (
              <div className="flex justify-center">
                <Button asChild>
                  <Link to="/blog/new">Create blog post</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {isLoading && (
              <p className="text-center text-muted-foreground">Loading posts...</p>
            )}
            {error && !isLoading && (
              <p className="text-center text-destructive">{error}</p>
            )}
            {!isLoading && !error && posts.length === 0 && (
              <p className="text-center text-muted-foreground">
                No blog posts yet. {user ? "Be the first to create one!" : ""}
              </p>
            )}
            {!isLoading &&
              !error &&
              posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary transition-colors"
                >
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                  </Link>
                  <p className="text-xs text-muted-foreground mb-3">
                    {post.author?.name ? `By ${post.author.name} • ` : ""}
                    {post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                  )}
                  {user && post.authorId === user.id && (
                    <div className="mt-3 flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog/${post.slug}/edit`}>Edit</Link>
                      </Button>
                    </div>
                  )}
                </article>
              ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;

