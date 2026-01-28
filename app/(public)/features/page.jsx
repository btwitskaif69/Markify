import FeaturesPage from "@/app/(public)/_components/Features";
import StructuredData from "@/components/SEO/StructuredData";
import { FEATURES, getFeaturePath } from "@/data/features";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Features for Fast Search",
  description:
    "Explore Markify features like lightning search, smart collections, auto-tagging, and privacy-first bookmarking built for faster organization.",
  path: "/features",
  keywords: [
    "bookmark manager features",
    "bookmark tools",
    "organize bookmarks",
    "markify features",
  ],
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
  ]);
  const featuresItemListSchema = buildItemListSchema(
    FEATURES.map((feature) => ({
      name: feature.title,
      path: getFeaturePath(feature.slug),
    })),
    { name: "Markify Features" }
  );

  return (
    <>
      <StructuredData data={[breadcrumbs, featuresItemListSchema].filter(Boolean)} />
      <FeaturesPage />
    </>
  );
}
