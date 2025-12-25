import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Spotlight } from "../ui/spotlight-new";
import SEO from "../SEO/SEO";
import { getCanonicalUrl } from "@/lib/seo";

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect to get started with Markify.",
    features: [
      "Up to 3 collections",
      "Basic bookmarking",
      "Light & dark themes",
      "Access on any device",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    description: "For power users and busy professionals.",
    features: [
      "Unlimited collections & bookmarks",
      "Advanced search & filters",
      "Priority feature updates",
      "Email support",
    ],
    cta: "Upgrade to Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$19",
    description: "Collaborate on research and resources as a team.",
    features: [
      "Shared collections",
      "Roles & permissions",
      "Team activity overview",
      "Priority support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

const PricingPage = () => {
  return (
    <>
      <SEO
        title="Pricing"
        description="Choose the perfect Markify plan for your needs. Simple, transparent pricing with no hidden fees. Free, Pro, and Team plans available."
        canonical={getCanonicalUrl("/pricing")}
      />
      <Navbar />

      <main className="bg-background text-foreground relative overflow-hidden">
        {/* Grid background */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 pointer-events-none
            [background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)]
            dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]"
          style={{
            backgroundSize: "68px 68px",
            backgroundPosition: "0 0",
            opacity: 1,
          }}
        />

        {/* Spotlight */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <Spotlight />
        </div>

        <section className="container mx-auto px-4 py-16 md:py-24 relative z-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-muted-foreground">
              Choose the plan that fits your workflow today and scale as you
              grow. No hidden fees or lock-in.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm ${tier.highlighted ? "ring-2 ring-primary" : ""
                  }`}
              >
                <h2 className="text-lg font-semibold mb-1">{tier.name}</h2>
                <p className="text-3xl font-bold mb-2">
                  {tier.price}
                  <span className="text-base font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {tier.description}
                </p>

                <ul className="mb-6 flex-1 space-y-2 text-sm text-muted-foreground">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={tier.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default PricingPage;
