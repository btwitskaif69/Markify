import PricingPage from "@/app/(public)/_components/Pricing";
import StructuredData from "@/components/SEO/StructuredData";
import { PRICING_TIERS } from "@/data/pricingTiers";
import {
  buildBreadcrumbSchema,
  buildProductSchema,
  buildWebPageSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Pricing & Plans",
  description:
    "Compare Markify Free, Pro, and Team plans with transparent pricing, feature limits, and collaboration options for individuals and teams.",
  path: "/pricing",
});

export default function Page() {
  const canonical = getCanonicalUrl("/pricing");
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: "Markify pricing",
    description:
      "Compare Markify Free, Pro, and Team plans with transparent pricing and feature limits.",
    path: "/pricing",
    type: "WebPage",
  });
  const productSchemas = PRICING_TIERS.map((tier) =>
    buildProductSchema({
      name: `Markify ${tier.name}`,
      description: tier.description,
      price: tier.price.replace("$", ""),
      currency: "USD",
      url: canonical,
    })
  );

  return (
    <>
      <StructuredData
        data={[webPageSchema, breadcrumbs, ...productSchemas].filter(Boolean)}
      />
      <PricingPage />
      <div className="sr-only">
        <h2>Markify Pricing: Find the Perfect Plan for Your Bookmark Management Needs</h2>
        <p>
          Choosing the right tool to manage your bookmarks and digital resources is a critical decision. 
          At Markify, we believe in transparent, straightforward pricing that scales with your needs. 
          Whether you are an individual looking to declutter your browser, a student compiling research, 
          or a growing team collaborating on shared collections, we have a pricing plan designed specifically for you.
        </p>
        <p>
          Our Free plan offers a robust set of features to get you started immediately. You can save unlimited bookmarks, 
          create nested folders, and take advantage of our powerful search capabilities without spending a dime. 
          It is the perfect entry point for anyone wanting to experience the best free bookmark manager on the market.
        </p>
        <p>
          For power users and professionals, the Pro plan unlocks advanced functionality such as AI-powered auto-tagging, 
          broken link detection, priority support, and enhanced security features. The Pro plan ensures your digital 
          workspace remains organized, even as your collection grows into the thousands.
        </p>
        <p>
          Teams and organizations will benefit from our collaborative Team plan. This tier allows you to create shared workspaces, 
          manage user permissions, and ensure that everyone in your company has access to the same curated resources. 
          Say goodbye to lost links in Slack channels or endless email threads. With Markify Team, knowledge sharing becomes effortless.
        </p>
        <p>
          Compare our pricing tiers to see detailed feature limits, integrations, and collaboration options. 
          We offer flexible monthly and annual billing cycles, with significant discounts for annual commitments. 
          Join the thousands of users who have streamlined their digital lives with Markify. Start for free today, 
          and upgrade whenever you need more power.
        </p>
      </div>
    </>
  );
}
