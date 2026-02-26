/* eslint-disable react/prop-types */
import UseCaseIntent from "@/app/(public)/_components/UseCaseIntent";
import StructuredData from "@/components/SEO/StructuredData";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoDetailPath,
  getPseoIndustriesForIntent,
  getPseoIntentBySlug,
  getPseoIntentIndex,
  getPseoIntentPath,
} from "@/lib/pseo";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export const generateStaticParams = async () =>
  getPseoIntentIndex().map((intent) => ({ intent: intent.slug }));

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const intentSlug = resolvedParams?.intent;
  const intent = getPseoIntentBySlug(intentSlug);

  if (!intent) {
    return buildMetadata({
      title: "Use case not found",
      description: "The requested use-case intent could not be found.",
      path: `/use-cases/${intentSlug || ""}`,
      noindex: true,
      nofollow: true,
    });
  }

  return buildMetadata({
    title: `${intent.title} Bookmark Workflows`,
    description: `${intent.description} Explore industry-specific pages for ${intent.title.toLowerCase()} workflows.`,
    path: getPseoIntentPath(intent.slug),
    keywords: [intent.primaryKeyword, ...(intent.keywords || [])].filter(Boolean),
  });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const intentSlug = resolvedParams?.intent;
  const intent = getPseoIntentBySlug(intentSlug);
  if (!intent) return notFound();

  const industries = getPseoIndustriesForIntent(intent.slug);
  const relatedIntents = getPseoIntentIndex()
    .filter((item) => item.slug !== intent.slug)
    .slice(0, 6);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: "/use-cases" },
    { name: intent.title, path: getPseoIntentPath(intent.slug) },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: `${intent.title} workflows`,
    description: intent.description,
    path: getPseoIntentPath(intent.slug),
    type: "CollectionPage",
  });
  const itemListSchema = buildItemListSchema(
    industries.map((industry) => ({
      name: `${intent.title} for ${industry.name}`,
      path: getPseoDetailPath(intent.slug, industry.slug),
    })),
    { name: `${intent.title} industries` }
  );

  return (
    <>
      <StructuredData
        data={[webPageSchema, breadcrumbs, itemListSchema].filter(Boolean)}
      />
      <UseCaseIntent
        intent={intent}
        industries={industries}
        relatedIntents={relatedIntents}
      />
    </>
  );
}
