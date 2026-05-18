"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import Link from "next/link";

const FinalCTA = () => {
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const rotate = useMotionValue(0);
    const currentSpeed = useRef(0.18);

    useAnimationFrame((t, delta) => {
        const targetSpeed = isLogoHovered ? 0.03 : 0.18;
        // Smoothly interpolate speed
        currentSpeed.current += (targetSpeed - currentSpeed.current) * 0.05;
        rotate.set((rotate.get() + delta * currentSpeed.current) % 360);
    });

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-5 py-16 md:py-24">
            <div className="relative z-20 flex flex-col items-center justify-center gap-[16px]">
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2
                        className="mx-auto w-fit whitespace-nowrap text-2xl font-medium bg-clip-text text-transparent leading-normal md:text-5xl lg:text-6xl"
                        style={{
                            backgroundImage:
                                "linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)",
                        }}
                    >
                        Organize bookmarks with <span className="instrument-serif-regular-italic">Markify</span>
                    </h2>
                    <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-lg">
                        Save, sort, organize, and share your bookmarks with ease.
                    </p>
                </motion.div>
            </div>

            <div className="flex items-center justify-center relative mt-[-30px] h-[300px] w-full max-w-screen-xl gap-3 sm:mt-[34px]">
                <Link href="/signup" className="flex items-center justify-center relative z-20" aria-label="Sign up for Markify">
                    <motion.div
                        onHoverStart={() => setIsLogoHovered(true)}
                        onHoverEnd={() => setIsLogoHovered(false)}
                        className="group flex h-[4rem] w-[4rem] cursor-pointer items-center justify-center rounded-full border border-forground/20 bg-background p-0.5 text-foreground backdrop-blur-sm transition-all duration-500 ease-out sm:h-[5rem] sm:w-[5rem] sm:p-1 md:h-[6rem] md:w-[6rem] md:p-1.5"
                    >
                        <motion.div
                            style={{ rotate }}
                            className="flex h-[3rem] w-[3rem] items-center justify-center text-foreground transition-colors duration-500 ease-out group-hover:text-primary sm:h-[3.45rem] sm:w-[3.45rem] md:h-[3.85rem] md:w-[3.85rem]"
                        >
                            <span
                                className="block h-full w-full bg-current"
                                style={{
                                    WebkitMaskImage: "url(/assets/logo.svg)",
                                    maskImage: "url(/assets/logo.svg)",
                                    WebkitMaskRepeat: "no-repeat",
                                    maskRepeat: "no-repeat",
                                    WebkitMaskPosition: "center",
                                    maskPosition: "center",
                                    WebkitMaskSize: "contain",
                                    maskSize: "contain",
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </Link>
                
                <div className="absolute top-24 h-[500px] w-full max-w-[1300px] translate-x-10 overflow-hidden sm:top-16 lg:top-8 z-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <img width={703} height={364} className="absolute right-0 w-1/2 dark:invert-0 invert opacity-80 mix-blend-screen" src="/RightHand.png" alt="Right Hand" />
                    </motion.div>
                    <div className="from-background absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
                </div>

                <div className="absolute top-24 h-[500px] w-full max-w-[1300px] -translate-x-14 overflow-hidden sm:top-16 lg:top-8 z-10 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <img width={703} height={364} className="absolute left-0 w-1/2 dark:invert-0 invert opacity-80 mix-blend-screen" src="/LeftHand.png" alt="Left Hand" />
                    </motion.div>
                    <div className="from-background absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
