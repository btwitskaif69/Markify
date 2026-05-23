import { FREE_BOOKMARK_LIMIT } from "@/lib/subscription";

export const PRICING_TIERS = [
  {
    name: "Free",
    price: "0",
    description: "Great for individuals building a clean personal bookmark workflow.",
    features: [
      `Up to ${FREE_BOOKMARK_LIMIT} Bookmarks`,
      "Up to 2 Collections",
      "Cross-Browser Sync",
      "Single Import Option (No Export)",
    ],
    cta: "Start for free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "3.99",
    description: "Built for professionals and teams that need speed and scale.",
    features: [
      "Everything in Free",
      "Chrome Extension Access",
      "Unlimited Bookmarks",
      "Unlimited Collections",
      "Bookmark & Collection Shareability",
      "Multi Import & Export Options",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "19",
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
