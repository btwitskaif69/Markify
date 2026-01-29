import UseCaseIntent from "@/app/(public)/_components/UseCaseIntent";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoHubPath,
  getPseoIntentBySlug,
  getPseoIntentIndex,
  getPseoIntentPath,
  getPseoDetailPath,
  getPseoIndustriesForIntent,
} from "@/lib/pseo";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export const dynamicParams = true;

export const generateStaticParams = () => {
  const intents = getPseoIntentIndex();
  return intents.map((intent) => ({ intent: intent.slug }));
};

export const generateMetadata = ({ params }) => {
  const intent = getPseoIntentBySlug(params.intent);
  if (!intent) {
    return buildMetadata({
      title: "Use case not found",
      description: "The requested use case could not be found.",
      path: getPseoHubPath(),
      noindex: true,
      nofollow: true,
    });
  }

  const seoTitle = `${intent.title} bookmarks by industry`;
  const seoDescription = `${intent.description} Explore industry-specific bookmark workflows that keep ${intent.title.toLowerCase()} resources organized and searchable.`;

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: getPseoIntentPath(intent.slug),
    keywords: [intent.primaryKeyword, ...intent.keywords],
  });
};

export default function Page({ params }) {
  const intent = getPseoIntentBySlug(params.intent);
  if (!intent) return notFound();

  const industries = getPseoIndustriesForIntent(intent.slug);
  const relatedIntents = getPseoIntentIndex()
    .filter((item) => item.slug !== intent.slug)
    .slice(0, 4);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: getPseoHubPath() },
    { name: intent.title, path: getPseoIntentPath(intent.slug) },
  ]);
  const itemListSchema = buildItemListSchema(
    industries.map((industry) => ({
      name: industry.name,
      path: getPseoDetailPath(intent.slug, industry.slug),
    })),
    { name: `${intent.title} by industry` }
  );
  const webPageSchema = buildWebPageSchema({
    title: `${intent.title} by industry`,
    description: intent.description,
    path: getPseoIntentPath(intent.slug),
    type: "CollectionPage",
  });
  const structuredData = [webPageSchema, breadcrumbs, itemListSchema].filter(Boolean);

  return (
    <>
      <StructuredData data={structuredData} />
      <UseCaseIntent
        intent={intent}
        industries={industries}
        relatedIntents={relatedIntents}
      />
    </>
  );
}
