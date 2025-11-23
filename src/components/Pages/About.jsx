import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Spotlight } from "../ui/spotlight-new";

import SEO from "../SEO/SEO";

const About = () => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn more about Markify, our mission to revolutionize bookmark management, and the team behind the project."
        canonical="https://www.markify.tech/about"
      />
      <Navbar />

      <main className="bg-background text-foreground relative overflow-hidden">
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
          }}
        />

        {/* Spotlight */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        <section className="container mx-auto px-4 py-16 md:py-24 relative z-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            About Markify
          </h1>
          <p className="text-muted-foreground max-w-2xl mb-10">
            <Link to="/" className="text-primary hover:underline">Markify</Link> is your central hub for saving, organizing, and revisiting
            the content that matters most. From articles and documentation to
            tutorials and tools, we help you keep everything in one clean,
            searchable workspace.
          </p>

          <section className="grid gap-8 md:grid-cols-3">
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
          </section>

          <section className="mt-12 p-6 rounded-xl border border-border bg-card/50">
            <h3 className="text-xl font-semibold mb-4">Learn More</h3>
            <p className="text-muted-foreground mb-4">
              Explore more about how Markify can transform your workflow:
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="text-primary hover:underline">View our pricing plans</Link> - Choose the plan that fits your needs
              </li>
              <li>
                <Link to="/blog" className="text-primary hover:underline">Read our blog</Link> - Tips, updates, and insights
              </li>
              <li>
                <Link to="/contact" className="text-primary hover:underline">Contact us</Link> - Have questions? We're here to help
              </li>
              <li>
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> - Learn how we protect your data
              </li>
            </ul>
          </section>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;


