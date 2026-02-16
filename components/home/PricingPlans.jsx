"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free Plan",
        price: "$0",
        description: "Perfect for individuals just starting out.",
        buttonText: "Get Started",
        buttonStyle: "default",
        features: [
            "Access to essential bookmark tools",
            "Up to 100 bookmarks",
            "Basic tagging features",
            "Cross-browser sync",
            "Community support",
        ],
    },
    {
        name: "Pro Plan",
        price: "$12",
        yearlyPrice: "$8",
        description: "Perfect for individuals and small teams.",
        buttonText: "Get Started",
        buttonStyle: "primary",
        popular: true,
        features: [
            "Everything in the Free Plan, plus:",
            "Unlimited bookmarks",
            "Advanced AI organization",
            "Priority customer support",
            "Team collaboration features",
            "Custom collections and templates",
        ],
    },
];

const PricingPlans = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: false }}
                >
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-medium bg-gradient-to-b from-foreground to-primary/90 bg-clip-text text-transparent leading-normal whitespace-nowrap">
                        Choose the <span className="italic">Right Plan</span> for Your Team
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Expand your workflow as per your requirements
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            className={cn(
                                "relative overflow-hidden rounded-3xl border p-6 md:p-8 flex flex-col",
                                plan.popular
                                    ? "bg-gradient-to-b from-amber-500/10 to-card border-amber-500/30"
                                    : "bg-card border-border"
                            )}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: false }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-foreground">
                                    {plan.name}
                                </h3>
                                {plan.popular && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            Bill yearly
                                        </span>
                                        <button
                                            onClick={() => setIsYearly(!isYearly)}
                                            className={cn(
                                                "relative w-10 h-5 rounded-full transition-colors duration-200",
                                                isYearly ? "bg-amber-500" : "bg-muted"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200",
                                                    isYearly && "translate-x-5"
                                                )}
                                            />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-2">
                                <span
                                    className={cn(
                                        "text-4xl md:text-5xl font-bold",
                                        plan.popular ? "text-amber-500" : "text-foreground"
                                    )}
                                >
                                    {plan.popular && isYearly ? plan.yearlyPrice : plan.price}
                                </span>
                                <span className="text-muted-foreground">/month</span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6">
                                {plan.description}
                            </p>

                            {/* Button */}
                            <Link
                                href="/pricing"
                                className={cn(
                                    "w-full py-3 px-4 rounded-full text-center font-medium transition-all duration-200 mb-2",
                                    plan.popular
                                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                                        : "bg-muted hover:bg-muted/80 text-foreground"
                                )}
                            >
                                {plan.buttonText}
                            </Link>

                            <p className="text-xs text-center text-muted-foreground mb-6">
                                Free forever
                            </p>

                            {/* Features */}
                            <ul className="space-y-3 mt-auto">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <Check
                                            className={cn(
                                                "w-4 h-4 mt-0.5 flex-shrink-0",
                                                plan.popular ? "text-amber-500" : "text-muted-foreground"
                                            )}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingPlans;
