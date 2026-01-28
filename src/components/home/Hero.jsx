"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "../ui/spotlight-new";
import { ChevronRight } from "lucide-react";
import SparklesIcon from "@/components/ui/sparkles-icon";
import Link from "next/link";
import ShinyText from "../ShinyText";

const Hero = () => {
  const sparklesRef = useRef(null);

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

      {/* Spotlight above grid background but below content */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <Spotlight />
      </div>

      {/* Hero Content */}
      <section className="relative z-20 flex items-center justify-center min-h-[100vh]">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center">
          {/* Tagline */}
          <Link href="/signup" className="inline-block">
            <Button
              variant="outline"
              className="group border px-6 py-3 rounded-full inline-flex items-center gap-1 text-sm font-medium cursor-pointer bg-transparent!"
              onMouseEnter={() => sparklesRef.current?.startAnimation()}
              onMouseLeave={() => sparklesRef.current?.stopAnimation()}
            >
              <SparklesIcon ref={sparklesRef} size={25} color="#facc15" strokeWidth={2} className="fill-yellow-400" />
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
          <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold leading-[1.1] tracking-tight text-foreground">
            <span className="block">The <span className="text-primary">Smarter</span> Bookmark Manager.</span>
            <span className="block">Save. Organize. Find <span className="text-primary">Instantly.</span></span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-4xl mb-5">
            Never lose a bookmark again. Save links in one click, organize them into smart collections, and find any bookmark with lightning-fast search. Markify is the 100% free bookmark manager designed for productivity.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link href="/signup">
              <Button size="lg" className="text-lg rounded-full shadow-md w-full sm:w-auto cursor-pointer text-black dark:text-white font-semibold">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                aria-label="Learn more about Markify bookmark manager"
                className="text-lg rounded-full border-foreground/20 hover:bg-foreground/10 w-full sm:w-auto"
              >
                About Markify
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
