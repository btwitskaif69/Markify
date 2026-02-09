"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const FinalCTA = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/[0.03] to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
                {/* Top text */}
                <motion.p
                    className="text-center text-sm md:text-base text-muted-foreground mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: false }}
                >
                    Markify provides pre-configured options for quick start-ups. As your
                    team grows, adaptation becomes effortless.
                </motion.p>

                {/* Main CTA Card */}
                <motion.div
                    className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-12 text-center"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    {/* Glow effects */}
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/20 rounded-full blur-3xl" />

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 relative z-10">
                        Ready to manage your
                        <br />
                        bookmarks like a <span className="italic">pro</span>?
                    </h2>

                    <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-8 relative z-10">
                        Markify offers ready-made solutions to get you going fast. Easily
                        customize as your needs expand.
                    </p>

                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-muted hover:bg-muted/80 text-foreground font-medium transition-all duration-200 relative z-10"
                    >
                        Get Started
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
