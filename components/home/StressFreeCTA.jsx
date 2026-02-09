"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const StressFreeCTA = () => {
    return (
        <section className="py-20 px-4 md:px-8 bg-black text-white overflow-hidden relative">
            <div className="max-w-6xl mx-auto text-center relative z-10">

                {/* Main Heading with "Pills" */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center justify-center gap-4 md:gap-6"
                >
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                        <span>Take the first step towards</span>
                        <span className="inline-flex items-center gap-2 bg-[#2A2A2A] px-5 py-2 rounded-full text-2xl md:text-4xl lg:text-5xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <span className="text-3xl md:text-5xl">😇</span>
                            <span className="text-[#FF9D7E]">stress-free</span>
                        </span>
                    </h2>

                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight flex flex-wrap justify-center items-center gap-x-4 gap-y-2">
                        <span>project management with</span>
                        <span className="inline-flex items-center gap-2 bg-[#2A2A2A] px-5 py-2 rounded-full text-2xl md:text-4xl lg:text-5xl border border-white/10 shadow-lg transform hover:scale-105 transition-transform duration-300">
                            <span className="text-[#FFDBB8]">Markify</span>
                            <span className="text-3xl md:text-5xl">👋</span>
                        </span>
                    </h2>

                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight text-white/90 mt-2">
                        Simplify tasks, boost productivity
                    </h2>
                </motion.div>


                {/* Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12"
                >
                    <Link href="/signup">
                        <Button
                            size="lg"
                            className="rounded-full px-10 py-8 text-xl bg-[#2A2A2A] hover:bg-[#333] border border-white/10 text-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Get Started
                        </Button>
                    </Link>
                </motion.div>

            </div>

            {/* Subtle Background Glow/Noise if needed, keeping it clean for now per image */}
        </section>
    );
};

export default StressFreeCTA;
