import Feature from "@/app/(public)/_components/Feature";
import StructuredData from "@/components/SEO/StructuredData";
import { FEATURES, getFeatureBySlug, getFeaturePath } from "@/data/features";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildKeywordContext,
  getRelatedFeatureLinks,
  getRelatedIntentLinks,
  getRelatedSolutionLinks,
} from "@/lib/seo/internal-links";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export const generateStaticParams = () =>
  FEATURES.map((feature) => ({ slug: feature.slug }));

const buildFeatureMetadata = (feature) => {
  const seoTitle = `${feature.title} Bookmark Manager Feature`;
  const seoDescription = `${feature.description} Learn how Markify keeps bookmarks organized and easy to find.`;
  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: getFeaturePath(feature.slug),
    keywords: feature.keywords,
  });
};

export const generateMetadata = ({ params }) => {
  const feature = getFeatureBySlug(params.slug);
  if (!feature) {
    return buildMetadata({
      title: "Feature not found",
      description: "The requested feature could not be found.",
      path: `/features/${params.slug}`,
      noindex: true,
      nofollow: true,
    });
  }

  return buildFeatureMetadata(feature);
};

export default function Page({ params }) {
  const feature = getFeatureBySlug(params.slug);
  if (!feature) return notFound();

  const keywordContext = buildKeywordContext(
    feature.keywords,
    feature.title,
    feature.description
  );
  const relatedFeatures = getRelatedFeatureLinks(keywordContext, {
    excludeSlugs: [feature.slug],
    limit: 3,
  });
  const relatedSolutions = getRelatedSolutionLinks(keywordContext, { limit: 3 });
  const relatedIntents = getRelatedIntentLinks(keywordContext, { limit: 3 });

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: feature.title, path: getFeaturePath(feature.slug) },
  ]);
  const faqSchema = buildFaqSchema(feature.faqs);
  const webPageSchema = buildWebPageSchema({
    title: feature.title,
    description: feature.description,
    path: getFeaturePath(feature.slug),
    type: "WebPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs, faqSchema].filter(Boolean)} />
      <Feature
        feature={feature}
        relatedFeatures={relatedFeatures}
        relatedSolutions={relatedSolutions}
        relatedIntents={relatedIntents}
      />
    </>
  );
}
