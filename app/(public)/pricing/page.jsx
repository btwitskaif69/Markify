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
    </>
  );
}
