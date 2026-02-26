/* eslint-disable react/prop-types */
import UseCaseIndustry from "@/app/(public)/_components/UseCaseIndustry";
import StructuredData from "@/components/SEO/StructuredData";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoDetailPath,
  getPseoIndustryBySlug,
  getPseoIndustryIndex,
  getPseoIndustryPath,
  getPseoIntentsForIndustry,
} from "@/lib/pseo";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export const generateStaticParams = async () =>
  getPseoIndustryIndex().map((industry) => ({ industry: industry.slug }));

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const industrySlug = resolvedParams?.industry;
  const industry = getPseoIndustryBySlug(industrySlug);

  if (!industry) {
    return buildMetadata({
      title: "Industry page not found",
      description: "The requested industry workflow page could not be found.",
      path: `/industries/${industrySlug || ""}`,
      noindex: true,
      nofollow: true,
    });
  }

  return buildMetadata({
    title: `${industry.name} Bookmark Workflows`,
    description: `${industry.description} Explore workflow pages mapped by intent for ${industry.name.toLowerCase()} teams.`,
    path: getPseoIndustryPath(industry.slug),
    keywords: [...(industry.keywords || []), "bookmark workflows"].filter(Boolean),
  });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const industrySlug = resolvedParams?.industry;
  const industry = getPseoIndustryBySlug(industrySlug);
  if (!industry) return notFound();

  const intents = getPseoIntentsForIndustry(industry.slug);
  const relatedIndustries = getPseoIndustryIndex()
    .filter((item) => item.slug !== industry.slug)
    .slice(0, 6);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Industries", path: "/industries" },
    { name: industry.name, path: getPseoIndustryPath(industry.slug) },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: `${industry.name} workflows`,
    description: industry.description,
    path: getPseoIndustryPath(industry.slug),
    type: "CollectionPage",
  });
  const itemListSchema = buildItemListSchema(
    intents.map((intent) => ({
      name: `${intent.title} for ${industry.name}`,
      path: getPseoDetailPath(intent.slug, industry.slug),
    })),
    { name: `${industry.name} intents` }
  );

  return (
    <>
      <StructuredData
        data={[webPageSchema, breadcrumbs, itemListSchema].filter(Boolean)}
      />
      <UseCaseIndustry
        industry={industry}
        intents={intents}
        relatedIndustries={relatedIndustries}
      />
    </>
  );
}
