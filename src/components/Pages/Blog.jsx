import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const posts = [
  {
    title: "Introducing Markify",
    date: "January 2025",
    readingTime: "4 min read",
    summary:
      "Why we built Markify and how it helps you organize your digital world.",
  },
  {
    title: "5 ways to reduce tab overload",
    date: "February 2025",
    readingTime: "6 min read",
    summary:
      "Practical strategies for keeping your browser clean and your focus sharp.",
  },
  {
    title: "Building a second brain for your links",
    date: "March 2025",
    readingTime: "5 min read",
    summary:
      "How to turn scattered bookmarks into a structured knowledge system.",
  },
];

const Blog = () => {
  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Blog
            </h1>
            <p className="text-muted-foreground">
              Tips, updates, and ideas on building better workflows and managing
              your knowledge with Markify.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {posts.map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary transition-colors"
              >
                <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                <p className="text-xs text-muted-foreground mb-3">
                  {post.date} • {post.readingTime}
                </p>
                <p className="text-sm text-muted-foreground">{post.summary}</p>
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

