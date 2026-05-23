"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, Sparkles, Bookmark, Laptop, Layers, Folder, Share2, ArrowRightLeft, Download } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/client/context/AuthContext";
import { FREE_BOOKMARK_LIMIT } from "@/lib/subscription";

const PLANS = [
    {
        name: "Free Plan",
        price: "$0",
        description: "Great for individuals building a clean personal bookmark workflow.",
        cta: "Start Free",
        badge: "Best for personal use",
        popular: false,
        features: [
            { text: `Up to ${FREE_BOOKMARK_LIMIT} Bookmarks`, icon: Bookmark },
            { text: "Up to 2 Collections", icon: Folder },
            { text: "Cross-Browser Sync", icon: Laptop },
            { text: "Single Import Option (No Export)", icon: Download },
        ],
    },
    {
        name: "Pro Plan",
        price: "$3.99",
        description: "Built for professionals and teams that need speed and scale.",
        cta: "Get Pro",
        badge: "For teams and power users",
        popular: true,
        features: [
            { text: "Everything in Free", icon: Layers },
            // { text: "Chrome Extension Access", icon: Puzzle },
            { text: "Unlimited Bookmarks", icon: Bookmark },
            { text: "Unlimited Collections", icon: Folder },
            { text: "Bookmark & Collection Shareability", icon: Share2 },
            { text: "Multi Import & Export Options", icon: ArrowRightLeft },
        ],
    },
];

const PricingPlans = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { token, user, hasProAccess, updateProfile } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const billingSyncHandledRef = useRef(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const billingSuccess = searchParams.get("billing") === "success" || searchParams.get("success") === "true";
    const billingSubscriptionId = searchParams.get("subscription_id") || "";
    const dashboardHref = mounted && user ? `/dashboard/${user.id}` : null;

    useEffect(() => {
        if (!mounted || !billingSuccess) {
            billingSyncHandledRef.current = false;
            return;
        }

        if (billingSyncHandledRef.current || !user || !token) {
            return;
        }

        billingSyncHandledRef.current = true;

        const syncSubscription = async () => {
            try {
                if (!billingSubscriptionId) {
                    router.replace(dashboardHref || "/dashboard");
                    return;
                }

                const response = await fetch("/api/billing/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        subscriptionId: billingSubscriptionId,
                    }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result?.message || "Failed to synchronize subscription.");
                }

                if (result?.user) {
                    updateProfile(result.user);
                }

                localStorage.removeItem("markify_pending_subscription");

                toast.success("Pro subscription activated.");
            } catch (error) {
                console.error("Pricing page subscription sync failed:", error);
                toast.error(error?.message || "Could not verify your subscription yet.");
            } finally {
                router.replace(dashboardHref || `/dashboard/${user.id}`);
            }
        };

        void syncSubscription();
    }, [mounted, billingSuccess, billingSubscriptionId, token, user, updateProfile, router, dashboardHref]);

    const handlePlanAction = async (plan) => {
        if (plan.name === "Free Plan") {
            if (dashboardHref) {
                router.push(dashboardHref);
            } else {
                router.push("/signup");
            }
            return;
        }

        if (hasProAccess && dashboardHref) {
            router.push(dashboardHref);
            return;
        }

        if (!token) {
            router.push("/login?redirect=/pricing");
            return;
        }

        setIsCheckingOut(true);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to create checkout session");
            }

            const data = await response.json();
            if (data.url) {
                localStorage.setItem(
                    "markify_pending_subscription",
                    JSON.stringify({
                        startedAt: Date.now(),
                        source: "pricing-page",
                    })
                );
                window.location.href = data.url;
                return;
            }

            throw new Error("Checkout URL was not returned.");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong with the checkout process.");
        } finally {
            setIsCheckingOut(false);
        }
    };

    const getButtonLabel = (plan) => {
        if (plan.name === "Free Plan") {
            return dashboardHref ? "Open Dashboard" : plan.cta;
        }

        if (hasProAccess && dashboardHref) {
            return "Open Dashboard";
        }

        if (isCheckingOut) {
            return "Getting Pro...";
        }

        return plan.cta;
    };

    return (
        <section className="w-full py-16 md:py-24 bg-background relative overflow-hidden">

            <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2
                        className="text-2xl md:text-5xl lg:text-6xl font-medium bg-clip-text text-transparent leading-normal"
                        style={{
                            backgroundImage:
                                "linear-gradient(to bottom, #fdba74 0%, #f97316 45%, #c2410c 100%)",
                        }}
                    >
                        Choose the <span className="instrument-serif-regular-italic">Right Plan</span> for Your Team
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Expand your workflow as per your requirements
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 max-w-4xl mx-auto">
                    {PLANS.map((plan) => (
                        <article
                            key={plan.name}
                            className="relative overflow-hidden rounded-[30px] border border-border bg-card p-5 md:p-6"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0"
                                style={{
                                    backgroundImage: plan.popular
                                        ? "none"
                                        : "radial-gradient(95% 95% at 0% 0%, color-mix(in oklch, var(--primary) 28%, transparent) 0%, transparent 58%), radial-gradient(95% 95% at 100% 100%, color-mix(in oklch, var(--primary) 20%, transparent) 0%, transparent 62%)",
                                }}
                            />
                            {plan.popular && (
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="pointer-events-none absolute inset-0 h-full w-full translate-x-20 -translate-y-25 rotate-45 scale-[1.7] object-cover"
                                >
                                    <source src="/flames.mp4" />
                                </video>
                            )}
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-[10px] rounded-3xl"
                            />
                            <div className={`relative z-10 h-full flex flex-col ${plan.popular ? "text-white" : ""}`}>
                                <div className="mb-6 flex items-center justify-between gap-3">
                                    <h3 className={`text-2xl font-semibold ${plan.popular ? "text-white" : "text-foreground"}`}>
                                        {plan.name}
                                    </h3>

                                    {plan.popular ? (
                                        <Sparkles className={`h-6 w-6 ${plan.popular ? "text-white" : "text-foreground"}`} />
                                    ) : (
                                        <BookOpen className="h-6 w-6 text-foreground" />
                                    )}
                                </div>

                                <div className="mb-2 flex items-end gap-1">
                                    <span
                                        className={`text-5xl font-medium tracking-tight ${plan.popular ? "text-white" : "text-foreground"}`}
                                    >
                                        {plan.price}
                                    </span>
                                    <span className={`pb-1 text-2xl ${plan.popular ? "text-white/50" : "text-foreground/50"}`}>/month</span>
                                </div>

                                <p className={`mb-8 text-base ${plan.popular ? "text-white/60" : "text-foreground/50"}`}>{plan.description}</p>

                                <ul className={`mb-8 flex-1 space-y-4 text-base ${plan.popular ? "text-white/60" : "text-foreground/50"}`}>
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <feature.icon className={`h-5 w-5 shrink-0 mt-0.5 ${plan.popular ? "text-white" : "text-foreground"}`} />
                                            <span>{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto">
                                    <Button
                                        size="lg"
                                        variant={plan.popular ? "default" : "outline"}
                                        className={`mb-2 w-full rounded-full ${plan.popular ? "bg-white text-black hover:bg-white/80" : "bg-transparent hover:bg-secondary/20"}`}
                                        onClick={() => handlePlanAction(plan)}
                                        disabled={plan.name === "Pro Plan" && isCheckingOut}
                                    >
                                        <span className="text-lg font-medium">{getButtonLabel(plan)}</span>
                                    </Button>


                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section >
    );
};

export default PricingPlans;
