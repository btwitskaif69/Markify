import Solutions from "@/app/(public)/_components/Solutions";
import StructuredData from "@/components/SEO/StructuredData";
import { SOLUTIONS, getSolutionPath } from "@/data/solutions";
import { buildBreadcrumbSchema, buildItemListSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Solutions for Every Team",
  description:
    "Explore Markify solutions for researchers, designers, developers, students, and teams who need organized, searchable bookmark workflows.",
  path: "/solutions",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
  ]);
  const solutionsItemListSchema = buildItemListSchema(
    SOLUTIONS.map((solution) => ({
      name: solution.title,
      path: getSolutionPath(solution.slug),
    })),
    { name: "Markify Solutions" }
  );

  return (
    <>
      <StructuredData
        data={[breadcrumbs, solutionsItemListSchema].filter(Boolean)}
      />
      <Solutions />
    </>
  );
}
