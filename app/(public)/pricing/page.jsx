import PricingPage from "@/app/(public)/_components/Pricing";
import StructuredData from "@/components/seo/StructuredData";
import { PRICING_TIERS } from "@/data/pricingTiers";
import { buildBreadcrumbSchema, buildProductSchema, getCanonicalUrl } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Pricing & Plans",
  description:
    "Compare Free, Pro, and Team plans for Markify's bookmark manager with transparent pricing and no hidden fees.",
  path: "/pricing",
});

export default function Page() {
  const canonical = getCanonicalUrl("/pricing");
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Pricing", path: "/pricing" },
  ]);
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
      <StructuredData data={[breadcrumbs, ...productSchemas].filter(Boolean)} />
      <PricingPage />
    </>
  );
}
