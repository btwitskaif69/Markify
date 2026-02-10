"use client";

import React, { useEffect, useState } from "react";
import { Marquee as FastMarquee } from "@/components/ui/marquee";

const logoData = [
    { name: "Next.js", src: "/assets/nextjs.svg" },
    { name: "Tailwind CSS", src: "/assets/tailwindcss.svg" },
    { name: "shadcn/ui", src: "/assets/shadcn.svg" },
    { name: "Prisma", src: "/assets/prisma.svg" },
    { name: "PostgreSQL", src: "/assets/Postgresql.svg" },
    { name: "Lucide", src: "/assets/lucide.svg" },
    { name: "Vercel", src: "/assets/vercel.svg" },
];

const Marquee = () => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial check
        setIsDark(document.documentElement.classList.contains("dark"));

        // Observer for theme changes
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <section className="w-full pt-0 pb-6 md:pb-10 bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-8 md:mb-10">
                    <h2 className="text-2xl md:text-6xl font-medium bg-gradient-to-b from-foreground to-primary/90 bg-clip-text text-transparent leading-normal">
                        Powered by the Best Technology
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                        Built on a modern, battle-tested stack to deliver speed, reliability, and a seamless experience across every device.
                    </p>
                </div>

                {/* Logo Cards */}
                <div className="relative overflow-hidden">
                    {/* Gradient overlays for smooth fade effect */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10" />

                    <FastMarquee pauseOnHover className="[--duration:30s] [--gap:3rem]">
                        {logoData.map((logo, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-center px-4"
                            >
                                <img
                                    src={logo.src}
                                    alt={`${logo.name} logo`}
                                    loading="lazy"
                                    decoding="async"
                                    className={`h-7 md:h-8 w-auto object-contain brightness-0 ${isDark ? 'invert' : ''}`}
                                />
                            </div>
                        ))}
                    </FastMarquee>
                </div>
            </div>
        </section>
    );
};

export default Marquee;
