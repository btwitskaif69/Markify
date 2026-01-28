import Solution from "@/app/(public)/_components/Solution";
import StructuredData from "@/components/seo/StructuredData";
import { SOLUTIONS, getSolutionBySlug, getSolutionPath } from "@/data/solutions";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { notFound } from "next/navigation";

export const dynamicParams = false;

export const generateStaticParams = () =>
  SOLUTIONS.map((solution) => ({ slug: solution.slug }));

const buildSolutionMetadata = (solution) => {
  const solutionAudience = solution.title.replace(/^Bookmark manager for /i, "").trim();
  const seoDescription = `${solution.description} Markify keeps workflows organized for ${solutionAudience} with smart collections, sharing, and fast search.`;
  return buildMetadata({
    title: solution.title,
    description: seoDescription,
    path: getSolutionPath(solution.slug),
    keywords: solution.keywords,
  });
};

export const generateMetadata = ({ params }) => {
  const solution = getSolutionBySlug(params.slug);
  if (!solution) {
    return buildMetadata({
      title: "Solution not found",
      description: "The requested solution could not be found.",
      path: `/solutions/${params.slug}`,
      noindex: true,
      nofollow: true,
    });
  }

  return buildSolutionMetadata(solution);
};

export default function Page({ params }) {
  const solution = getSolutionBySlug(params.slug);
  if (!solution) return notFound();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
    { name: solution.title, path: getSolutionPath(solution.slug) },
  ]);
  const faqSchema = buildFaqSchema(solution.faqs);

  return (
    <>
      <StructuredData data={[breadcrumbs, faqSchema].filter(Boolean)} />
      <Solution />
    </>
  );
}
