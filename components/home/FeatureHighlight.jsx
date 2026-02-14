"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FeatureHighlight = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const avatars = [
        {
            id: 1,
            src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            barWidth: "280px",
            delay: 0
        },
        {
            id: 2,
            src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            barWidth: "220px",
            delay: 0.2
        },
        {
            id: 3,
            src: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
            barWidth: "180px",
            delay: 0.4
        },
        {
            id: 4,
            src: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
            barWidth: "240px",
            delay: 0.6
        },
    ];

    return (
        <section className="w-full py-16 md:py-24 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                    {/* Text Content */}
                    <motion.div
                        className="flex-1 max-w-2xl"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-tight mb-6">
                            <span className="italic">Your All-in-One</span> Bookmark Manager for a Clutter-Free
                            <br />
                            Browsing Experience
                        </h2>
                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                            Save websites instantly, organize them into custom collections, and find what you need in seconds. Markify transforms the way you manage bookmarks across all your devices.
                        </p>
                    </motion.div>

                    {/* Avatars with Progress Bars */}
                    <div className="flex flex-col gap-6">
                        {avatars.map((avatar) => (
                            <motion.div
                                key={avatar.id}
                                className="flex items-center gap-4"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: avatar.delay }}
                                viewport={{ once: true }}
                            >
                                {/* Avatar */}
                                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full ring-2 ring-border overflow-hidden bg-muted flex-shrink-0">
                                    <img
                                        src={avatar.src}
                                        alt="User avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Animated Progress Bar */}
                                <div className="relative h-2 md:h-3 rounded-full overflow-hidden bg-muted/30" style={{ width: avatar.barWidth }}>
                                    <motion.div
                                        className="absolute inset-y-0 left-0 rounded-full"
                                        style={{
                                            background: "linear-gradient(90deg, #b45309 0%, #ea580c 50%, #f97316 100%)",
                                            boxShadow: "0 0 20px rgba(249, 115, 22, 0.5), 0 0 40px rgba(249, 115, 22, 0.3)",
                                        }}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{
                                            duration: 1.2,
                                            delay: avatar.delay + 0.3,
                                            ease: "easeOut"
                                        }}
                                        viewport={{ once: true }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureHighlight;
