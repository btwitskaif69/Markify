"use client";

import Link from "next/link";
import { BookOpen, Check, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

const PLANS = [
    {
        name: "Free Plan",
        price: "$0",
        description: "Great for individuals building a clean personal bookmark workflow.",
        cta: "Start Free",
        href: "/signup",
        badge: "Best for personal use",
        popular: false,
        features: [
            "Core bookmark tools",
            "Up to 100 saved bookmarks",
            "Basic tagging and organization",
            "Cross-browser sync",
            "Community support",
        ],
    },
    {
        name: "Pro Plan",
        price: "$12",
        description: "Built for professionals and teams that need speed and scale.",
        cta: "Get Pro",
        href: "/pricing",
        badge: "For teams and power users",
        popular: true,
        features: [
            "Everything in Free, plus:",
            "Unlimited bookmarks and collections",
            "Advanced AI-powered organization",
            "Priority support",
            "Team collaboration features",
            "Custom collections and templates",
        ],
    },
];

const PricingPlans = () => {
    return (
        <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.02] to-transparent pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-medium bg-clip-text text-transparent leading-normal whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
                        Choose the <span className="instrument-serif-regular-italic">Right Plan</span> for Your Team
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Expand your workflow as per your requirements
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                    {PLANS.map((plan) => (
                        <article
                            key={plan.name}
                            className="relative overflow-hidden rounded-[30px] border border-white/15 bg-black p-6 md:p-8"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    backgroundImage: plan.popular
                                        ? "radial-gradient(90% 90% at 0% 0%, color-mix(in oklch, var(--primary) 42%, transparent) 0%, transparent 58%), radial-gradient(90% 90% at 100% 100%, color-mix(in oklch, var(--primary) 34%, transparent) 0%, transparent 62%)"
                                        : "radial-gradient(90% 90% at 0% 0%, color-mix(in oklch, var(--primary) 30%, transparent) 0%, transparent 56%), radial-gradient(90% 90% at 100% 100%, color-mix(in oklch, var(--primary) 24%, transparent) 0%, transparent 60%)",
                                }}
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-[10px] rounded-3xl"
                            />
                            <div className="relative z-10 h-full">
                                <div className="mb-6 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-amber-500/35 bg-amber-500/10">
                                            {plan.popular ? (
                                                <Sparkles className="h-4 w-4 text-amber-400" />
                                            ) : (
                                                <BookOpen className="h-4 w-4 text-amber-400" />
                                            )}
                                        </span>
                                        <h3 className="text-2xl font-semibold text-foreground">
                                            {plan.name}
                                        </h3>
                                    </div>

                                    {plan.popular ? (
                                        <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-amber-300">
                                            Popular
                                        </span>
                                    ) : null}
                                </div>

                                <div className="mb-2 flex items-end gap-1">
                                    <span
                                        className={`text-5xl font-bold ${plan.popular ? "text-primary" : "text-foreground"
                                            }`}
                                    >
                                        {plan.price}
                                    </span>
                                    <span className="pb-1 text-2xl text-muted-foreground">/month</span>
                                </div>

                                <p className="mb-8 text-base text-muted-foreground">{plan.description}</p>

                                <Button
                                    href={plan.href} size="lg" className="w-full rounded-full mb-2">
                                    {plan.cta}
                                </Button>

                                <p className="mb-8 text-center text-sm text-muted-foreground">{plan.badge}</p>

                                <ul className="space-y-4 text-base text-foreground/95">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3">
                                            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-500/35 bg-emerald-500/20">
                                                <Check className="h-3 w-3 text-emerald-300" />
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default PricingPlans;
