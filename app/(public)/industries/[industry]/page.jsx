import UseCaseIndustry from "@/app/(public)/_components/UseCaseIndustry";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoDetailPath,
  getPseoIndustryBySlug,
  getPseoIndustryIndex,
  getPseoIndustryPath,
  getPseoIndustryHubPath,
  getPseoIntentsForIndustry,
} from "@/lib/pseo";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 86400;
export const dynamicParams = false;

export const generateStaticParams = () =>
  getPseoIndustryIndex().map((industry) => ({ industry: industry.slug }));

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const industry = getPseoIndustryBySlug(resolvedParams?.industry);
  if (!industry) {
    return buildMetadata({
      title: "Industry not found",
      description: "The requested industry page could not be found.",
      path: getPseoIndustryHubPath(),
      noindex: true,
      nofollow: true,
    });
  }

  const seoTitle = `${industry.name} bookmark workflows`;
  const seoDescription = `${industry.description} Discover intent-based bookmark workflows built for ${industry.name.toLowerCase()} teams.`;

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: getPseoIndustryPath(industry.slug),
    keywords: industry.keywords,
  });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const industry = getPseoIndustryBySlug(resolvedParams?.industry);
  if (!industry) return notFound();

  const intents = getPseoIntentsForIndustry(industry.slug);
  const relatedIndustries = getPseoIndustryIndex()
    .filter((item) => item.slug !== industry.slug)
    .slice(0, 4);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Industries", path: getPseoIndustryHubPath() },
    { name: industry.name, path: getPseoIndustryPath(industry.slug) },
  ]);
  const itemListSchema = buildItemListSchema(
    intents.map((intent) => ({
      name: intent.title,
      path: getPseoDetailPath(intent.slug, industry.slug),
    })),
    { name: `${industry.name} use cases` }
  );
  const webPageSchema = buildWebPageSchema({
    title: `${industry.name} use cases`,
    description: industry.description,
    path: getPseoIndustryPath(industry.slug),
    type: "CollectionPage",
  });
  const structuredData = [webPageSchema, breadcrumbs, itemListSchema].filter(Boolean);

  return (
    <>
      <StructuredData data={structuredData} />
      <UseCaseIndustry
        industry={industry}
        intents={intents}
        relatedIndustries={relatedIndustries}
      />
    </>
  );
}
