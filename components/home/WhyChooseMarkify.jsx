"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, X, Bookmark } from "lucide-react";

const markifyFeatures = [
    "Smart AI-powered organization",
    "Lightning-fast search & discovery",
    "Cross-browser sync & backup",
    "Advanced tagging system",
    "Beautiful visual interface",
];

const otherToolsFlaws = [
    "Manual folder management",
    "Limited search capabilities",
    "No cross-browser support",
    "Basic or no tagging",
    "Cluttered, outdated designs",
];

const helpCards = [
    {
        title: "Effortless",
        highlight: "Organization",
        description:
            "Keep all your bookmarks organized and visible in one place. Markify helps you save, tag, and prioritize links easily, ensuring nothing falls through the cracks.",
    },
    {
        title: "Seamless",
        highlight: "Cross-Browser Sync",
        description:
            "Access your bookmarks from any browser, anytime. Markify's collaborative tools make it easy to share collections and keep everyone in sync.",
    },
    {
        title: "Comprehensive",
        highlight: "Search & Discovery",
        description:
            "Stay on top of your saved content with powerful search and AI-powered discovery. Markify gives you the insights you need to find the right link in seconds.",
    },
];

const WhyChooseMarkify = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Why Choose Section */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        Why Choose <span className="italic">Markify</span>?
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        An immediate contrast of Markify's functionalities against other
                        bookmark management utilities. Discover why we excel.
                    </p>
                </motion.div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 md:mb-28">
                    {/* Markify Card */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                    >
                        {/* Subtle glow effect */}
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                <Bookmark className="w-5 h-5 text-amber-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground">
                                Markify
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {markifyFeatures.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                    viewport={{ once: false }}
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-emerald-500" />
                                    </div>
                                    <span className="text-sm md:text-base text-foreground/90">
                                        {feature}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Other Tools Card */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-muted-foreground">
                                Other tools
                            </h3>
                        </div>

                        <ul className="space-y-4">
                            {otherToolsFlaws.map((flaw, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                    viewport={{ once: false }}
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center">
                                        <X className="w-3 h-3 text-rose-500" />
                                    </div>
                                    <span className="text-sm md:text-base text-muted-foreground">
                                        {flaw}
                                    </span>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* How Markify Helps You Section */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                        How <span className="italic">Markify</span> helps you
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Markify offers ready-made solutions to get you going fast. Easily
                        customize as your needs expand.
                    </p>
                </motion.div>

                {/* Help Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First row - 2 cards */}
                    {helpCards.slice(0, 2).map((card, index) => (
                        <motion.div
                            key={index}
                            className="relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 group"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                            viewport={{ once: false }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 relative z-10">
                                <span className="italic font-normal text-muted-foreground">
                                    {card.title}
                                </span>{" "}
                                {card.highlight}
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative z-10">
                                {card.description}
                            </p>
                        </motion.div>
                    ))}

                    {/* Second row - 1 full-width card */}
                    <motion.div
                        className="md:col-span-2 relative overflow-hidden rounded-3xl bg-card border border-border p-6 md:p-8 group"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: false }}
                    >
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="max-w-2xl mx-auto text-center">
                            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 relative z-10">
                                <span className="italic font-normal text-muted-foreground">
                                    {helpCards[2].title}
                                </span>{" "}
                                {helpCards[2].highlight}
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed relative z-10">
                                {helpCards[2].description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyChooseMarkify;
