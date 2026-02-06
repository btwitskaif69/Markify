"use client";

import { Button } from "@/components/ui/button";
import { Spotlight } from "../ui/spotlight-new";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import DashboardPreview from "./DashboardPreview";
import ShinyText from "../ShinyText";

const Hero = () => {
  return (
    <div className="w-full overflow-x-clip">
      {/* Hero Content */}
      <section className="relative h-[100svh] md:h-screen">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
          style={{
            backgroundSize: "200px 200px",
            backgroundPosition: "0 0",
            opacity: 1,
            transform: "translateZ(0)",
          }}
        />

        {/* Spotlight above grid background but below content */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        <div className="relative z-20 grid h-full place-items-center">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-6 text-center md:px-12">
              {/* Tagline */}
              <div className="flex w-full justify-center">
                <Link href="/signup" className="inline-block">
                  <Button
                    variant="outline"
                    className="group border px-6 py-3 rounded-full inline-flex items-center gap-1 text-sm font-medium cursor-pointer backdrop-blur-sm"
                  >
                    <Sparkles className="text-yellow-400 fill-yellow-400 w-5 h-5" />
                    <ShinyText
                      text="Find any saved link in seconds"
                      disabled={false}
                      speed={3}
                      className="custom-class"
                    />
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 ease-in-out group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Heading */}
              <h1 className="mt-6 flex w-full flex-col items-center text-center text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl">
                <span className="inline-block text-center md:whitespace-nowrap">Your Saved Links, Organized</span>
                <span className="inline-block text-center md:whitespace-nowrap">With a Smarter Bookmark Manager</span>
              </h1>

              {/* Subheading */}
              <p className="mb-5 mt-4 max-w-5xl text-center text-lg text-muted-foreground md:text-2xl">
                Keep every link organized in collections, instantly searchable, and always in sync — with Markify’s clean, modern bookmark manager and one-click browser extension.
              </p>

              {/* Buttons */}
              <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/signup">
                  <Button size="lg" className="text-lg rounded-full shadow-md w-full sm:w-auto cursor-pointer min-w-[170px]">
                    Get Started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  aria-label="Learn more about Markify bookmark manager"
                  className="text-lg rounded-full border-foreground/20 hover:bg-foreground/10 w-full sm:w-auto min-w-[170px]"
                >
                  Learn More
                </Button>
              </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -translate-y-[17.5%] pb-8">
        <DashboardPreview />
      </section>
    </div>
  );
};

export default Hero;
