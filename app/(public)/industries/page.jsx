import UseCaseIndustries from "@/app/(public)/_components/UseCaseIndustries";
import StructuredData from "@/components/SEO/StructuredData";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPseoIndustryIndex, getPseoIndustryPath } from "@/lib/pseo";

export const metadata = buildMetadata({
  title: "Bookmark Workflows by Industry",
  description:
    "Browse Markify industry pages to see how teams organize bookmarks, research, and shared knowledge by workflow.",
  path: "/industries",
});

export default function Page() {
  const industries = getPseoIndustryIndex();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: "Markify industries",
    description:
      "Browse industry-specific bookmark workflows for marketing, product, support, and more.",
    path: "/industries",
    type: "CollectionPage",
  });
  const itemListSchema = buildItemListSchema(
    industries.map((industry) => ({
      name: industry.name,
      path: getPseoIndustryPath(industry.slug),
    })),
    { name: "Industry workflows" }
  );

  return (
    <>
      <StructuredData
        data={[webPageSchema, breadcrumbs, itemListSchema].filter(Boolean)}
      />
      <UseCaseIndustries industries={industries} />
    </>
  );
}
