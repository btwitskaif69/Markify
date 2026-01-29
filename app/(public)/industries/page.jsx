import UseCaseIndustries from "@/app/(public)/_components/UseCaseIndustries";
import StructuredData from "@/components/SEO/StructuredData";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoIndustryHubPath,
  getPseoIndustryIndex,
  getPseoIndustryPath,
} from "@/lib/pseo";

export const revalidate = 86400;

export const generateMetadata = () =>
  buildMetadata({
    title: "Bookmark Manager Industries",
    description:
      "Explore industry-specific bookmark workflows for teams who need fast search, smart collections, and shareable knowledge hubs.",
    path: getPseoIndustryHubPath(),
    keywords: ["industries", "bookmark manager", "programmatic seo"],
  });

export default function Page() {
  const industries = getPseoIndustryIndex();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Industries", path: getPseoIndustryHubPath() },
  ]);
  const itemListSchema = buildItemListSchema(
    industries.map((industry) => ({
      name: industry.name,
      path: getPseoIndustryPath(industry.slug),
    })),
    { name: "Markify industries" }
  );
  const webPageSchema = buildWebPageSchema({
    title: "Markify industries",
    description:
      "Industry-specific bookmark workflows built for fast search and shared knowledge.",
    path: getPseoIndustryHubPath(),
    type: "CollectionPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs, itemListSchema].filter(Boolean)} />
      <UseCaseIndustries industries={industries} />
    </>
  );
}
