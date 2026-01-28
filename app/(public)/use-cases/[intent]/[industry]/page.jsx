import UseCaseDetail from "@/app/(public)/_components/UseCaseDetail";
import StructuredData from "@/components/seo/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoHubPath,
  getPseoIntentPath,
  getPseoPageBySlugs,
  getPseoStaticParams,
  getPseoQualitySignals,
} from "@/lib/pseo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export const dynamicParams = true;

export const generateStaticParams = () => {
  const limit = Number(process.env.PSEO_BUILD_LIMIT || 2000);
  const offset = Number(process.env.PSEO_BUILD_OFFSET || 0);
  return getPseoStaticParams({ limit, offset });
};

export const generateMetadata = ({ params }) => {
  const page = getPseoPageBySlugs(params.intent, params.industry);
  if (!page) {
    return buildMetadata({
      title: "Use case not found",
      description: "The requested use case could not be found.",
      path: getPseoHubPath(),
      noindex: true,
      nofollow: true,
    });
  }

  const seoTitle = `${page.intent.title} bookmarks for ${page.industry.name} teams`;
  const baseDescription = page.description || "";
  const extraDescription = `Build a searchable ${page.intent.title.toLowerCase()} library for ${page.industry.name.toLowerCase()} teams with Markify.`;
  const seoDescription =
    baseDescription.length >= 120
      ? baseDescription
      : `${baseDescription} ${extraDescription}`.trim();
  const quality = getPseoQualitySignals(page);

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: page.path,
    keywords: page.keywords,
    noindex: quality.isThin,
  });
};

export default function Page({ params }) {
  const page = getPseoPageBySlugs(params.intent, params.industry);
  if (!page) return notFound();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: getPseoHubPath() },
    { name: page.intent.title, path: getPseoIntentPath(page.intent.slug) },
    { name: page.industry.name, path: page.path },
  ]);
  const faqSchema = buildFaqSchema(page.faqs);
  const relatedItems = [
    ...page.related.intents.map((intent) => ({
      name: `${intent.title} for ${page.industry.name}`,
      path: `/use-cases/${intent.slug}/${page.industry.slug}`,
    })),
    ...page.related.industries.map((industry) => ({
      name: `${page.intent.title} for ${industry.name}`,
      path: `/use-cases/${page.intent.slug}/${industry.slug}`,
    })),
  ];
  const relatedSchema = buildItemListSchema(relatedItems, {
    name: `${page.intent.title} related pages`,
  });
  const webPageSchema = buildWebPageSchema({
    title: page.title,
    description: page.description,
    path: page.path,
    type: "CollectionPage",
  });
  const structuredData = [
    webPageSchema,
    breadcrumbs,
    faqSchema,
    relatedSchema,
  ].filter(Boolean);

  return (
    <>
      <StructuredData data={structuredData} />
      <UseCaseDetail page={page} />
    </>
  );
}
