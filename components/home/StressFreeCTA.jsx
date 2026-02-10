"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";


const StressFreeCTA = () => {
    return (
        <section className="py-20 px-4 md:px-8 bg-background text-foreground overflow-hidden relative">
            <div className="max-w-6xl mx-auto text-center relative z-10">

                {/* Main Heading with "Pills" */}
                <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-tight flex flex-nowrap justify-center items-center gap-x-4 gap-y-2 whitespace-nowrap">
                        <ScrollReveal
                            enableBlur={false}
                            blurStrength={0}
                            baseOpacity={0}
                            baseRotation={0}
                            wordAnimationEnd="center center"
                            containerClassName="inline"
                            textClassName="!text-[inherit] !font-medium !leading-[inherit]"
                        >
                            Take the first step towards a
                        </ScrollReveal>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-background px-5 py-2 rounded-full text-2xl md:text-4xl lg:text-5xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <span className="text-3xl md:text-5xl">😇</span>
                            <span className="text-primary">stress-free</span>
                        </motion.span>
                        <ScrollReveal
                            enableBlur={false}
                            blurStrength={0}
                            baseOpacity={0}
                            baseRotation={0}
                            wordAnimationEnd="center center"
                            containerClassName="inline"
                            textClassName="!text-[inherit] !font-medium !leading-[inherit]"
                        >
                            bookmark experience
                        </ScrollReveal>
                    </h2>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-tight flex flex-nowrap justify-center items-center gap-x-4 gap-y-2 whitespace-nowrap">
                        <ScrollReveal
                            enableBlur={false}
                            blurStrength={0}
                            baseOpacity={0}
                            baseRotation={0}
                            wordAnimationEnd="center center"
                            containerClassName="inline"
                            textClassName="!text-[inherit] !font-medium !leading-[inherit]"
                        >
                            Organize, sync, and manage everything with
                        </ScrollReveal>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="inline-flex items-center gap-2 bg-background px-5 py-2 rounded-full text-2xl md:text-4xl lg:text-5xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <span className="text-primary">Markify</span>
                            <span className="text-3xl md:text-5xl">👋</span>
                        </motion.span>
                    </h2>

                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-tight flex flex-nowrap justify-center items-center whitespace-nowrap">
                        <ScrollReveal
                            enableBlur={false}
                            blurStrength={0}
                            baseOpacity={0}
                            baseRotation={0}
                            wordAnimationEnd="center center"
                            containerClassName="inline"
                            textClassName="!text-[inherit] !font-medium !leading-[inherit]"
                        >
                            Simplify your workflow and boost productivity
                        </ScrollReveal>
                    </h2>
                </div>


                {/* Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-5"
                >
                    <Link href="/signup">
                        <Button
                            size="lg"
                            className="group rounded-full px-12 py-7 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.4)] hover:scale-105"
                        >
                            Get Started
                            <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Button>
                    </Link>
                </motion.div>

            </div>

            {/* Subtle Background Glow/Noise if needed, keeping it clean for now per image */}
        </section>
    );
};

export default StressFreeCTA;

