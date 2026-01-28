import Feature from "@/app/(public)/_components/Feature";
import StructuredData from "@/components/seo/StructuredData";
import { FEATURES, getFeatureBySlug, getFeaturePath } from "@/data/features";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
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

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: feature.title, path: getFeaturePath(feature.slug) },
  ]);
  const faqSchema = buildFaqSchema(feature.faqs);

  return (
    <>
      <StructuredData data={[breadcrumbs, faqSchema].filter(Boolean)} />
      <Feature />
    </>
  );
}
