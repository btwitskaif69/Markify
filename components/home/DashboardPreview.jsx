"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useTheme } from "../theme-provider";

const PREVIEW_DARK = "https://assets.markify.tech/assets/dashboard-dark.png";
const PREVIEW_LIGHT = "https://assets.markify.tech/assets/dashboard-light.png";
const ANIMATION_LOAD_ID = Date.now();
const PREVIEW_ANIMATION_DELAY = 1.75;

const DashboardPreview = () => {
  const { theme } = useTheme();
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.set(".dashboard-preview-frame", { y: 42, autoAlpha: 0 });
      gsap.set(".dashboard-preview-outline", { y: 42, autoAlpha: 0 });
      gsap.set(".dashboard-preview-media", { y: 42, autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: PREVIEW_ANIMATION_DELAY });

      tl.to(".dashboard-preview-frame", {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
      }).to(".dashboard-preview-outline, .dashboard-preview-media", {
        y: 0,
        autoAlpha: 1,
        duration: 0.75,
      }, "-=0.25");
    }, rootRef);

    return () => ctx.revert();
  }, [ANIMATION_LOAD_ID]);

  return (
    <div ref={rootRef} className="flex w-full items-center justify-center px-4">
      <div className="dashboard-preview-frame relative w-[90vw] max-w-[1600px] min-w-[350px]">
        <div className="relative z-10 rounded-md sm:rounded-3xl p-1 sm:p-3">
          <div
            aria-hidden="true"
            className="dashboard-preview-outline pointer-events-none absolute inset-0 rounded-md sm:rounded-3xl p-1 sm:p-3"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in srgb, var(--color-primary) 78%, transparent) 0%, color-mix(in srgb, var(--color-primary) 32%, transparent) 44%, color-mix(in srgb, var(--color-primary) 8%, transparent) 72%, color-mix(in srgb, var(--color-primary) 0%, transparent) 100%)",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div className="dashboard-preview-media relative overflow-hidden rounded-lg sm:rounded-2xl">
            <Image
              src={theme === "dark" ? PREVIEW_DARK : PREVIEW_LIGHT}
              alt="Markify dashboard preview showing bookmark management interface"
              width={1160}
              height={700}
              className="w-full h-auto object-cover rounded-lg sm:rounded-2xl"
              sizes="(max-width: 640px) 90vw, (max-width: 1600px) 90vw, 1600px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPreview;
