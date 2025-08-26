import React from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "../ui/spotlight-new";
import { ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardPreview from "./DashboardPreview";
import ShinyText from "../ShinyText";

const Hero = () => {
  return (
    <div className="relative w-full overflow-x-clip">
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

      {/* Spotlight */}
      <Spotlight />

      {/* Hero Content */}
      <section className="relative z-10 flex items-center justify-center min-h-[100vh]">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
          {/* Tagline */}
          <Link to="/signup" className="inline-block">
            <Button
              variant="outline"
              className="group border px-6 py-3 rounded-full inline-flex items-center gap-1 text-sm font-medium cursor-pointer bg-transparent!"
            >
              <Sparkles className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                <ShinyText 
                  text="Never Lose a Bookmark Again!"
                  disabled={false} 
                  speed={3} 
                  className='custom-class'
                />
                <ChevronRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
            </Button>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-medium leading-tight tracking-tight text-foreground max-w-6xl">
            Save, Organize, and Access Your Bookmarks Smarter
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mb-5">
            Keep every link organized, searchable, and accessible with Markify’s clean, modern bookmark manager.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link to="/signup">
            <Button size="lg" className="text-lg rounded-full shadow-md w-full sm:w-auto cursor-pointer">
              Get Started
            </Button>
            </Link>
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
