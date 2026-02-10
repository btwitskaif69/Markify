"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe } from "@/components/ui/globe";
import { AnimatedList } from "@/components/ui/animated-list";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { ImagesBadge } from "@/components/ui/images-badge";
import BotDetection from "@/components/bot-detection";
import { BarChart3, Zap, Calendar, Search, Bookmark, FolderPlus, Tag, Share2, Chrome, Globe2 } from "lucide-react";

const features = [
    {
        name: "Shared Bookmarks",
        description: "Collaborate with your team",
        icon: <Share2 className="w-4 h-4 text-purple-500" />,
    },
    {
        name: "Smart Collections",
        description: "Organize with AI precision",
        icon: <FolderPlus className="w-4 h-4 text-green-500" />,
    },
    {
        name: "Import/Export",
        description: "Seamless data migration",
        icon: <Zap className="w-4 h-4 text-yellow-500" />,
    },
    {
        name: "Auto-Tagging",
        description: "Automatic categorization",
        icon: <Tag className="w-4 h-4 text-orange-500" />,
    },
];

const getGlobeConfig = (isDark) => ({
    width: 800,
    height: 800,
    devicePixelRatio: 2,
    phi: 0,
    theta: 0.3,
    dark: isDark ? 1 : 0,
    diffuse: 1.2,
    mapSamples: 16000,
    mapBrightness: isDark ? 6 : 1.5,
    baseColor: isDark ? [0.3, 0.3, 0.3] : [0.95, 0.95, 0.95],
    markerColor: [0.89, 0.36, 0.09], // Deep orange - matches primary color
    glowColor: [0.89, 0.45, 0.15], // Warm orange glow
    markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
    ],
});

const FeatureItem = ({ name, description, icon }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border/50">
        <div className="p-2 rounded-lg bg-background">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
        </div>
    </div>
);

const AnalyticsBeamCard = () => {
    const containerRef = useRef(null);
    const div1Ref = useRef(null);
    const div2Ref = useRef(null);
    const div3Ref = useRef(null);

    return (
        <motion.div
            className="relative overflow-hidden rounded-3xl bg-background border border-border p-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false }}
        >
            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                Advanced Analytics
            </h3>
            <div
                ref={containerRef}
                className="relative h-[120px] flex items-center justify-between px-4"
            >
                <div ref={div1Ref} className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-muted border-2 border-border">
                    <Bookmark className="w-5 h-5 text-blue-500" />
                </div>
                <div ref={div2Ref} className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-muted border-2 border-border">
                    <FolderPlus className="w-5 h-5 text-green-500" />
                </div>
                <div ref={div3Ref} className="z-10 flex h-12 w-12 items-center justify-center rounded-full bg-muted border-2 border-border">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                </div>
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div1Ref}
                    toRef={div2Ref}
                    gradientStartColor="#3b82f6"
                    gradientStopColor="#22c55e"
                />
                <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={div2Ref}
                    toRef={div3Ref}
                    gradientStartColor="#22c55e"
                    gradientStopColor="#f97316"
                />
            </div>
            <p className="text-sm text-muted-foreground">
                Track your bookmark data flow and insights in real-time.
            </p>
        </motion.div>
    );
};

const BentoGridSection = () => {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsDark(document.documentElement.classList.contains("dark"));

        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains("dark"));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    const globeConfig = getGlobeConfig(isDark);
    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    <h2 className="text-2xl md:text-6xl font-medium bg-gradient-to-b from-foreground to-primary/90 bg-clip-text text-transparent leading-normal">
                        <span className="italic">Save time</span> and get more done
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Elevate your productivity. Manage bookmarks effortlessly by organizing
                        and visualizing everything in one central hub.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Large Card - Globe */}
                    <motion.div
                        className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-3xl bg-background border border-border p-6 md:p-8 min-h-[400px] lg:min-h-[500px]"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                    >
                        <div className="relative z-10">
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                                Real-Time Global Sync
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground max-w-md">
                                Access your bookmarks seamlessly across the globe. Stay connected
                                in real time, no matter where you are, ensuring everything is always up to date.
                            </p>
                        </div>

                        {/* Globe */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[60%] w-[900px] h-[900px] flex items-center justify-center cursor-grab active:cursor-grabbing z-20">
                            <div className="relative w-full h-full max-w-[900px] max-h-[900px]">
                                <Globe
                                    className="w-full h-full"
                                    config={globeConfig}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Small Card 1 - Analytics with Animated Beam */}
                    <AnalyticsBeamCard />

                    {/* Small Card 2 - Features List */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-background border border-border p-6"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: false }}
                    >
                        <h3 className="text-lg md:text-xl font-bold text-foreground mb-3">
                            Powerful Features
                        </h3>
                        <div className="relative h-[180px] overflow-hidden">
                            <AnimatedList delay={2000}>
                                {features.map((item, idx) => (
                                    <FeatureItem key={idx} {...item} />
                                ))}
                            </AnimatedList>
                        </div>
                    </motion.div>


                    {/* Bottom Card - Integrations with Orbiting Circles */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-background border border-border p-6 min-h-[400px] flex flex-col justify-between"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: false }}
                    >
                        <h3 className="text-lg md:text-xl font-bold text-foreground">
                            Seamless Integrations
                        </h3>
                        <div className="relative h-[200px] w-[200px] mx-auto flex-shrink-0 flex items-center justify-center">
                            <OrbitingCircles iconSize={40} radius={70}>
                                <Chrome className="w-8 h-8 text-blue-500" />
                                <Globe2 className="w-8 h-8 text-orange-500" />
                                <Calendar className="w-8 h-8 text-green-500" />
                                <Search className="w-8 h-8 text-purple-500" />
                            </OrbitingCircles>
                            <img src="/assets/logo.svg" alt="Markify" className="w-12 h-12 [filter:brightness(0)_saturate(100%)_invert(42%)_sepia(93%)_saturate(1352%)_hue-rotate(360deg)_brightness(98%)_contrast(100%)]" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Works with Chrome, Firefox, Edge, and more.
                        </p>
                    </motion.div>

                    {/* Bot Detection Card */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl min-h-[400px]"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45 }}
                        viewport={{ once: false }}
                    >
                        <BotDetection
                            cardTitle="Smart Security"
                            cardDescription="Your bookmarks are protected with AI-driven bot detection that keeps your data safe from unauthorized access and spam."
                        />
                    </motion.div>

                    {/* New Card - Collections with ImagesBadge */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-background border border-border p-6 min-h-[400px] flex flex-col justify-between"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        viewport={{ once: false }}
                    >
                        <h3 className="text-lg md:text-xl font-bold text-foreground">
                            Your Collections
                        </h3>
                        <div className="flex items-center justify-center min-h-[120px]">
                            <ImagesBadge
                                text="Browse All"
                                images={[
                                    "/images/dashboard-preview-dark-1160.webp",
                                    "/images/dashboard-preview-light-1160.webp",
                                    "/images/dashboard-preview-dark-1160.webp"
                                ]}
                                folderSize={{ width: 140, height: 105 }}
                                teaserImageSize={{ width: 80, height: 55 }}
                                hoverImageSize={{ width: 160, height: 110 }}
                                hoverTranslateY={-80}
                                hoverSpread={50}
                                hoverRotation={15}
                                href="/features"
                                className="flex-col gap-3"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Organize your bookmarks into visual collections.
                        </p>
                    </motion.div>


                </div>
            </div>
        </section>
    );
};

export default BentoGridSection;
