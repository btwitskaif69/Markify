"use client";

import { useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spotlight } from "../ui/spotlight-new";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import DashboardPreview from "./DashboardPreview";
import ShinyText from "../ShinyText";
import gsap from "gsap";

const Hero = () => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(".hero-tagline", { y: 18, autoAlpha: 0 });
      gsap.set(".hero-heading-line", { y: 42, autoAlpha: 0 });
      gsap.set(".hero-subheading", { y: 20, autoAlpha: 0 });
      gsap.set(".hero-cta", { y: 16, scale: 0.96, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".hero-tagline", {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
      })
        .to(
          ".hero-heading-line",
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.14,
          },
          "-=0.25"
        )
        .to(
          ".hero-subheading",
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
          },
          "-=0.45"
        )
        .to(
          ".hero-cta",
          {
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: 0.55,
          },
          "-=0.35"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="w-full overflow-x-clip">
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
            <div className="hero-tagline flex w-full justify-center">
              <Link href="/signup" className="inline-block">
                <Button
                  variant="outline"
                  className="group border px-6 py-3 rounded-full inline-flex items-center gap-1 text-sm font-medium cursor-pointer bg-transparent hover:!bg-transparent"
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
            <h1 className="mt-6 flex w-full flex-col items-center text-center text-4xl font-medium leading-tight tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl ">
              <span className="hero-heading-line inline-block text-center md:whitespace-nowrap ">The <span className="inline-block bg-clip-text text-transparent pb-1 box-decoration-clone" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>Only</span> Bookmark Manager</span>
              <span className="hero-heading-line inline-block text-center md:whitespace-nowrap ">You&apos;ll Ever <span className="inline-block bg-clip-text text-transparent box-decoration-clone" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>Need</span></span>
            </h1>

            {/* Subheading */}
            <p className="hero-subheading mb-5 mt-4 max-w-5xl text-center text-lg text-muted-foreground md:text-2xl">
              Never lose track of important websites again. Markify is the intelligent bookmark manager that helps you save, organize, and access your favorite links from anywhere.
            </p>

            {/* Buttons */}
            <div className="hero-cta mt-4 flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg rounded-full shadow-md w-full sm:w-auto cursor-pointer min-w-[170px]">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 -translate-y-[17.5%]">
        <DashboardPreview />
      </section>
    </div>
  );
};

export default Hero;
