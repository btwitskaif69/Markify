import React, { useEffect, useState, useRef } from "react";
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
import { Loader2 } from "lucide-react";
import { Spotlight } from "../ui/spotlight-new";
import { SkeletonCard } from "../ui/SkeletonCard";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const API_URL = `${import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:5000"
  }/api`;

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

import SEO from "../SEO/SEO";
import { secureFetch } from "@/lib/secureApi";

const Blog = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {


    const fetchPosts = async () => {
      // Simulate a slight delay to show off the skeleton loader (optional, remove in prod if needed)
      // await new Promise(resolve => setTimeout(resolve, 1500)); 

      try {
        const res = await secureFetch(`${API_URL}/blog`);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
  };

  return (
    <>
      <SEO
        title="Blog"
        description="Read the latest updates, tips, and insights from the Markify team."
        canonical="https://www.markify.tech/blog"
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
              <span className="text-muted-foreground">•</span>
              <Link to="/pricing" className="text-primary hover:underline">
                Pricing Plans
              </Link>
              <span className="text-muted-foreground">•</span>
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
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {posts.map((post) => (
                  <motion.article key={post.id} variants={item}>
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
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                loading="lazy"
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
                          <CardFooter className="pt-0 pb-5 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0">
                            Read article &rarr;
                          </CardFooter>
                        </Card>
                      </TiltCard>
                    </Link>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Blog;
