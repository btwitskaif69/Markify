import About from "@/app/(public)/_components/About";
import StructuredData from "@/components/SEO/StructuredData";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Mission & Story",
  description:
    "Discover how Markify was built to help people save, organize, and rediscover bookmarks with speed, privacy, and clarity.",
  path: "/about",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: "About Markify",
    description:
      "Discover the story behind Markify and the mission to simplify bookmark management.",
    path: "/about",
    type: "AboutPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs].filter(Boolean)} />
      <About />
    </>
  );
}
