"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
    Card,
    Header,
    Plan,
    PlanName,
    Badge,
    Price,
    MainPrice,
    Period,
    OriginalPrice,
    Description,
    Body,
    List,
    ListItem,
} from "@/components/ui/pricing-card";

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
                {/* Section Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-5xl lg:text-6xl font-medium bg-clip-text text-transparent leading-normal whitespace-nowrap" style={{ backgroundImage: 'linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)' }}>
                        Choose the <span className="instrument-serif-regular-italic">Right Plan</span> for Your Team
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Expand your workflow as per your requirements
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {plans.map((plan, index) => (
                        <Card
                            key={plan.name}
                            className="max-w-none"
                        >
                            <Header
                                glassEffect={plan.popular}
                                className={cn(
                                    "rounded-2xl",
                                    plan.popular
                                        ? "bg-amber-500/5 border-amber-500/20"
                                        : ""
                                )}
                            >
                                <Plan>
                                    <PlanName className="text-foreground text-lg font-medium">
                                        {plan.name}
                                    </PlanName>
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
                                    {plan.popular && <Badge>Popular</Badge>}
                                </Plan>

                                <Price>
                                    <MainPrice
                                        className={cn(
                                            "text-4xl md:text-5xl",
                                            plan.popular ? "text-amber-500" : "text-foreground"
                                        )}
                                    >
                                        {plan.popular && isYearly ? plan.yearlyPrice : plan.price}
                                    </MainPrice>
                                    <Period>/month</Period>
                                    {plan.popular && isYearly && (
                                        <OriginalPrice>{plan.price}</OriginalPrice>
                                    )}
                                </Price>

                                <Description className="text-sm">
                                    {plan.description}
                                </Description>
                            </Header>

                            <Body>
                                {/* Button */}
                                <Link
                                    href="/pricing"
                                    className={cn(
                                        "block w-full py-3 px-4 rounded-full text-center font-medium transition-all duration-200",
                                        plan.popular
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                                            : "bg-muted hover:bg-muted/80 text-foreground"
                                    )}
                                >
                                    {plan.buttonText}
                                </Link>

                                <p className="text-xs text-center text-muted-foreground">
                                    Free forever
                                </p>

                                {/* Features */}
                                <List>
                                    {plan.features.map((feature, idx) => (
                                        <ListItem key={idx}>
                                            <Check
                                                className={cn(
                                                    "w-4 h-4 mt-0.5 flex-shrink-0",
                                                    plan.popular ? "text-amber-500" : "text-muted-foreground"
                                                )}
                                            />
                                            <span>{feature}</span>
                                        </ListItem>
                                    ))}
                                </List>
                            </Body>
                        </Card>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default PricingPlans;

