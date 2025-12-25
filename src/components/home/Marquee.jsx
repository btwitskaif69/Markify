import React, { useEffect, useState } from "react";
import { Marquee as FastMarquee } from "@/components/ui/marquee";

// Import tech logos (light/dark)
import ReactLight from "@/assets/react-light.svg";
import ReactDark from "@/assets/react-dark.svg";
import ExpressLight from "@/assets/express-light.svg";
import ExpressDark from "@/assets/express-dark.svg";
import TailwindLight from "@/assets/tailwind-light.svg";
import TailwindDark from "@/assets/tailwind-dark.svg";
import ShadcnLight from "@/assets/shadcn-light.svg";
import ShadcnDark from "@/assets/shadcn-dark.svg";
import PrismaLight from "@/assets/prisma-light.svg";
import PrismaDark from "@/assets/prisma-dark.svg";

const logoData = [
    { name: "React", light: ReactLight, dark: ReactDark, width: 600, height: 181 },
    { name: "Express", light: ExpressLight, dark: ExpressDark, width: 64, height: 64 },
    { name: "Tailwind", light: TailwindLight, dark: TailwindDark, width: 96790, height: 12000 },
    { name: "shadcn/ui", light: ShadcnLight, dark: ShadcnDark, width: 256, height: 256 },
    { name: "Prisma", light: PrismaLight, dark: PrismaDark, width: 25986, height: 10214 },
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
        <section className="w-full py-12 md:py-16 bg-background">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        Powered by the Best Technology
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground max-w-md">
                        Built with modern, reliable, and scalable technologies to deliver the best experience.
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
                                className="flex items-center justify-center px-2"
                            >
                                <img
                                    src={isDark ? logo.light : logo.dark}
                                    alt={`${logo.name} logo`}
                                    width={logo.width}
                                    height={logo.height}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-10 w-auto md:h-14 max-w-none object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
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
