import Home from "@/app/(public)/_components/Home";
import StructuredData from "@/components/SEO/StructuredData";
import { HOME_FAQS } from "@/data/homeFaqs";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebApplicationSchema,
  buildWebPageSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

const pageDescription =
  "Keep every link organized in collections, instantly searchable, and always in sync with Markify's clean bookmark manager and one-click browser extension.";

export const metadata = buildMetadata({
  title: "Bookmark Manager for Saved Links & Teams",
  description: pageDescription,
  path: "/",
  keywords: [
    "bookmark manager",
    "save bookmarks",
    "organize links",
    "search bookmarks",
    "free bookmark manager",
    "bookmark organizer",
    "link manager",
  ],
});

export default function Page() {
  const faqSchema = buildFaqSchema(HOME_FAQS);
  const webAppSchema = buildWebApplicationSchema({
    description: pageDescription,
    url: getCanonicalUrl("/"),
  });
  const webPageSchema = buildWebPageSchema({
    title: "Bookmark Manager for Saved Links & Teams",
    description: pageDescription,
    path: "/",
    type: "WebPage",
  });
  const breadcrumbs = buildBreadcrumbSchema([{ name: "Home", path: "/" }]);
  const structuredData = [webPageSchema, breadcrumbs, faqSchema, webAppSchema].filter(Boolean);

  return (
    <>
      <StructuredData data={structuredData} />
      <Home />
    </>
  );
}
