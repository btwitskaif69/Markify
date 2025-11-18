import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
          <div className="max-w-4xl mx-auto mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              From the Markify Blog
            </h1>
            <p className="text-muted-foreground">
              Insights, updates, and ideas on building better workflows and
              managing your knowledge with Markify.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {isLoading && (
              <p className="text-center text-muted-foreground">Loading posts...</p>
            )}
            {error && !isLoading && (
              <p className="text-center text-destructive">{error}</p>
            )}
            {!isLoading && !error && posts.length === 0 && (
              <p className="text-center text-muted-foreground">
                No blog posts yet. Check back soon.
              </p>
            )}

            {!isLoading && !error && posts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-3">
                {/* Featured post */}
                <Link
                  to={`/blog/${posts[0].slug}`}
                  className="md:col-span-2 group"
                >
                  <Card className="h-full overflow-hidden border-border/70 bg-card/80 hover:bg-card hover:shadow-lg transition-all duration-200">
                    {posts[0].coverImage && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={posts[0].coverImage}
                          alt={posts[0].title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader className="space-y-2 border-b border-border/60">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {posts[0].author?.name
                            ? `By ${posts[0].author.name}`
                            : ""}
                        </span>
                        <span>
                          {posts[0].createdAt
                            ? new Date(posts[0].createdAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <CardTitle className="text-2xl md:text-3xl leading-tight group-hover:text-primary transition-colors">
                        {posts[0].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 pb-2">
                      {posts[0].excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {posts[0].excerpt}
                        </p>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 pb-4 text-xs text-primary">
                      Read more
                    </CardFooter>
                  </Card>
                </Link>

                {/* Remaining posts */}
                <div className="space-y-4">
                  {posts.slice(1).map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <Card className="border-border/60 bg-card/80 hover:bg-card hover:shadow-md transition-all duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between text-[0.7rem] text-muted-foreground mb-1">
                            <span>
                              {post.author?.name
                                ? `By ${post.author.name}`
                                : ""}
                            </span>
                            <span>
                              {post.createdAt
                                ? new Date(post.createdAt).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                          <CardTitle className="text-base group-hover:text-primary transition-colors">
                            {post.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                          {post.excerpt && (
                            <CardDescription>
                              {post.excerpt.length > 140
                                ? `${post.excerpt.slice(0, 140)}…`
                                : post.excerpt}
                            </CardDescription>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;

