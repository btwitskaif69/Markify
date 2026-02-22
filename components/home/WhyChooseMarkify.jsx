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
        title: "Smart",
        highlight: "Organization",
        description:
            "Tag, categorize, and search your bookmarks effortlessly. Markify helps you save, tag, and prioritize links easily.",
    },
    {
        title: "Sync",
        highlight: "Everywhere",
        description:
            "Access your saved links on desktop, mobile, and tablet. Your bookmarks follow you wherever you go.",
    },
    {
        title: "Lightning-Fast",
        highlight: "Search",
        description:
            "Find any bookmark in milliseconds with intelligent search. Never lose track of important content again.",
    },
    {
        title: "Visual",
        highlight: "Previews",
        description:
            "See thumbnail previews of every saved page. Identify content at a glance without opening tabs.",
    },
    {
        title: "Secure",
        highlight: "& Private",
        description:
            "Your bookmarks are encrypted and always under your control. Privacy is built into Markify's core.",
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
                    <h2 className="text-2xl md:text-6xl font-medium bg-clip-text text-transparent leading-normal" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
                        Why Choose <span className="instrument-serif-regular-italic">Markify</span>?
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        More Than Just a Bookmark Manager – It's Your Personal Web Library
                    </p>
                </motion.div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20 md:mb-28">
                    {/* Markify Card */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl border border-border p-6 md:p-8"
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                    >
                        {/* Copper Forge Background with Top Left & Bottom Right Glows */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
                                    radial-gradient(circle at top left, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%),
                                    radial-gradient(circle at bottom right, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%)
                                `,
                                backgroundColor: "var(--background)",
                            }}
                        />

                        <div className="relative z-10 flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-transparent border border-primary/20">
                                <Bookmark className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-foreground">
                                Markify
                            </h3>
                        </div>

                        <ul className="relative z-10 space-y-4">
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
                        className="relative overflow-hidden rounded-3xl border border-slate-500/30 p-6 md:p-8"
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: false }}
                    >
                        {/* Neutral Slate Background that complements Markify's warm palette */}
                        <div
                            className="absolute inset-0 z-0"
                            style={{
                                backgroundImage: `
                                    radial-gradient(circle at top right, rgba(100, 116, 139, 0.26), transparent 45%),
                                    radial-gradient(circle at bottom left, rgba(71, 85, 105, 0.3), transparent 55%)
                                `,
                                backgroundColor: "var(--background)",
                            }}
                        />

                        <div className="relative z-10 flex items-center gap-3 mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-slate-300">
                                Other tools
                            </h3>
                        </div>

                        <ul className="relative z-10 space-y-4">
                            {otherToolsFlaws.map((flaw, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                    viewport={{ once: false }}
                                >
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-400/20 flex items-center justify-center">
                                        <X className="w-3 h-3 text-slate-300" />
                                    </div>
                                    <span className="text-sm md:text-base text-slate-300/90">
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
                    <h2 className="text-2xl md:text-6xl font-medium bg-clip-text text-transparent leading-normal" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
                        How <span className="instrument-serif-regular-italic">Markify</span> helps you
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Markify offers ready-made solutions to get you going fast. Easily
                        customize as your needs expand.
                    </p>
                </motion.div>

                {/* Help Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {helpCards.map((card, index) => (
                        <motion.div
                            key={index}
                            className={`relative overflow-hidden rounded-3xl border border-border p-6 md:p-8 group ${index === 4 ? "md:col-span-2" : ""
                                }`}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.1 + index * 0.1,
                            }}
                            viewport={{ once: false }}
                        >
                            {/* Copper Forge Background with Top Left & Bottom Right Glows */}
                            <div
                                className="absolute inset-0 z-0"
                                style={{
                                    backgroundImage: `
                                    radial-gradient(circle at top left, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%),
                                    radial-gradient(circle at bottom right, color-mix(in srgb, var(--primary), transparent 75%), transparent 40%)
                                `,
                                    backgroundColor: "var(--background)",
                                }}
                            />

                            <div
                                className={`relative z-10 ${index === 4
                                    ? "max-w-2xl mx-auto text-center"
                                    : ""
                                    }`}
                            >
                                <h3 className={`text-xl md:text-2xl font-bold text-foreground mb-3 flex items-center flex-wrap ${index === 4 ? "justify-center" : ""}`}>
                                    <span
                                        className="instrument-serif-regular-italic font-normal mr-2 bg-clip-text text-transparent text-2xl md:text-3xl"
                                        style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}
                                    >
                                        {card.title}
                                    </span>
                                    <span>{card.highlight}</span>
                                </h3>
                                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseMarkify;
