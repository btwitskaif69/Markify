import React from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "../ui/spotlight-new";
import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-x-clip">
      {/* Grid background (behind everything) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none
          [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
          dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
        style={{
          backgroundSize: "68px 68px",
          backgroundPosition: "0 0", // grid starts at top-left of viewport
          mixBlendMode: "",
          opacity: 1, // tweak 0.06 - 0.18 to taste
          transform: "translateZ(0)",
        }}
      />

      {/* Decorative Spotlight (keeps its own absolute positioning) */}
      <Spotlight />

      {/* Hero Content (above grid) */}
      <section className="relative z-10 w-full flex items-center justify-center pb-20">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center space-y-4">
          {/* Tagline */}
          <Link to="/signup" className="inline-block">
            <Button
              variant="outline"
              className="group border px-6 py-3 rounded-full inline-flex items-center gap-1 text-sm font-medium bg-transparent!"
            >
              <Sparkles className="text-yellow-400 fill-yellow-400 w-5 h-5" />

              <span className="select-none">Never Lose a Bookmark Again</span>

              {/* chevron moves right on hover/focus to increase the gap */}
              <ChevronRight
                className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl md:text-8xl font-medium leading-tight tracking-tight text-foreground max-w-6xl">
            Save, Organize, and Access Your Bookmarks Smarter
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl">
            Keep every link organized, searchable, and accessible with Markify’s clean, modern bookmark manager.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Button
              size="lg"
              className="text-lg rounded-full shadow-md w-full sm:w-auto"
            >
              Get Started
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg rounded-full border-foreground/20 hover:bg-foreground/10 w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
