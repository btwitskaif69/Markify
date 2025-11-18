import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About Markify
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-10">
            Markify is your central hub for saving, organizing, and revisiting
            the content that matters most. From articles and documentation to
            tutorials and tools, we help you keep everything in one clean,
            searchable workspace.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Stay Organized</h2>
              <p className="text-sm text-muted-foreground">
                Group bookmarks into collections, add context, and quickly find
                what you saved with powerful search and filters.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Focus on What Matters</h2>
              <p className="text-sm text-muted-foreground">
                Reduce tab overload and information noise so you can return to
                the resources that actually move your work forward.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-2">Built for Builders</h2>
              <p className="text-sm text-muted-foreground">
                Designed for developers, designers, and knowledge workers who
                live on the web and need a reliable second brain for their links.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;

