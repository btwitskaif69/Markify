import { useEffect, useState } from "react";
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
import { Spotlight } from "../ui/spotlight-new";
import { SkeletonCard } from "../ui/SkeletonCard";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { API_BASE_URL } from "@/lib/apiConfig";
import { secureFetch } from "@/lib/secureApi";
import SEO from "../SEO/SEO";
import { buildBreadcrumbSchema, getCanonicalUrl } from "@/lib/seo";

const API_URL = API_BASE_URL;

const getPrerenderedPosts = () => {
  if (typeof window === "undefined") return [];
  const payload = window.__PRERENDER_BLOG_LIST__;
  return Array.isArray(payload) ? payload : [];
};

const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;

    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <div style={{ transform: "translateZ(75px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

// Animation for individual blog cards - matches BookmarkCard
const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 },
  transition: { duration: 0.3, ease: "easeOut" },
};

const Blog = () => {
  const initialPosts = getPrerenderedPosts();
  const hasPrerenderedPosts = initialPosts.length > 0;
  const [posts, setPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(!hasPrerenderedPosts);
  const [error, setError] = useState(null);
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  useEffect(() => {
    if (hasPrerenderedPosts) {
      setIsLoading(false);
      setError(null);
      return;
    }
    const fetchPosts = async () => {
      try {
        const res = await secureFetch(`${API_URL}/blog`);
        if (!res.ok) throw new Error("Failed to load blog posts.");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Blog fetch error:", err);
        setError(err.message || "Failed to load blog posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [hasPrerenderedPosts]);

  return (
    <>
      <SEO
        title="Bookmarking Tips & Updates"
        description="Read the latest bookmark management tips, product updates, and workflow ideas from the Markify team."
        canonical={getCanonicalUrl("/blog")}
        structuredData={breadcrumbs ? [breadcrumbs] : null}
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen relative overflow-hidden perspective-1000">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
          style={{
            backgroundSize: "68px 68px",
            backgroundPosition: "0 0",
            opacity: 1,
            transform: "translateZ(0)",
          }}
        />

        {/* Spotlight above grid background but below content */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        <section className="container mx-auto px-4 py-16 md:py-24 relative z-20">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              From the Markify Blog
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6"
            >
              Insights, updates, and ideas on building better workflows and
              managing your knowledge with Markify.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 text-sm"
            >
              <Link to="/about" className="text-primary hover:underline">
                Learn More About Markify
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">|</span>
              <Link to="/features" className="text-primary hover:underline">
                Explore Features
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">|</span>
              <Link to="/solutions" className="text-primary hover:underline">
                Browse Solutions
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">|</span>
              <Link to="/pricing" className="text-primary hover:underline">
                Pricing Plans
              </Link>
              <span className="text-muted-foreground" aria-hidden="true">|</span>
              <Link to="/contact" className="text-primary hover:underline">
                Contact Us
              </Link>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto">
            {isLoading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}
            {error && !isLoading && (
              <p className="text-center text-destructive py-10">{error}</p>
            )}
            {!isLoading && !error && posts.length === 0 && (
              <p className="text-center text-muted-foreground py-20">
                No blog posts yet. Check back soon.
              </p>
            )}

            {!isLoading && !error && posts.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <motion.article
                    key={post.id}
                    initial={cardAnimation.initial}
                    whileInView={cardAnimation.whileInView}
                    viewport={cardAnimation.viewport}
                    transition={cardAnimation.transition}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block h-full perspective-1000"
                    >
                      <TiltCard className="h-full">
                        <Card className="h-full flex flex-col overflow-hidden border-border/60 bg-card/80 hover:bg-card hover:shadow-2xl hover:border-primary/40 transition-all duration-300 !py-0 backdrop-blur-sm transform-style-3d">
                          <div className="aspect-video overflow-hidden bg-muted">
                            {post.coverImage ? (
                              <img
                                src={post.coverImage}
                                alt={post.title}
                                width={640}
                                height={360}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                No Image
                              </div>
                            )}
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span>
                                {post.author?.name ? post.author.name : "Markify"}
                              </span>
                              <span>
                                {post.createdAt
                                  ? new Date(post.createdAt).toLocaleDateString()
                                  : ""}
                              </span>
                            </div>
                            <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow pb-4">
                            {post.excerpt && (
                              <CardDescription className="line-clamp-3">
                                {post.excerpt}
                              </CardDescription>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0 pb-5 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                            Read article &rarr;
                          </CardFooter>
                        </Card>
                      </TiltCard>
                    </Link>
                  </motion.article>
                ))}
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
