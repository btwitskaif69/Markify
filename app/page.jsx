import Home from "@/app/(public)/_components/Home";
import StructuredData from "@/components/SEO/StructuredData";
import PublicLayout from "@/components/layouts/PublicLayout";
import { HOME_FAQS } from "@/data/homeFaqs";
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebApplicationSchema,
  buildWebsiteSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

const pageDescription =
  "Save links in one click, organize them into smart collections, and find any bookmark instantly. Markify is the fast, free bookmark manager built for productivity.";

export const metadata = buildMetadata({
  title: "Bookmark Manager for Fast Search",
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
  const orgSchema = buildOrganizationSchema();
  const websiteSchema = buildWebsiteSchema();
  const structuredData = [orgSchema, websiteSchema, faqSchema, webAppSchema].filter(Boolean);

  return (
    <PublicLayout>
      <StructuredData data={structuredData} />
      <Home />
    </PublicLayout>
  );
}
