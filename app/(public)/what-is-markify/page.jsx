import WhatIsMarkify from "@/app/(public)/_components/WhatIsMarkify";
import StructuredData from "@/components/SEO/StructuredData";
import { WHAT_IS_MARKIFY_FAQS } from "@/data/whatIsMarkifyFaqs";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "What Is a Smart Bookmark Manager",
  description:
    "Discover what Markify is, how it works, and why teams choose it over browser bookmarks. Learn features, compare alternatives, and see if it's right for you.",
  path: "/what-is-markify",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "What is Markify", path: "/what-is-markify" },
  ]);
  const faqSchema = buildFaqSchema(WHAT_IS_MARKIFY_FAQS);
  const webPageSchema = buildWebPageSchema({
    title: "What is Markify",
    description:
      "Learn how Markify compares to browser bookmarks and why teams choose it.",
    path: "/what-is-markify",
    type: "WebPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, faqSchema, breadcrumbs].filter(Boolean)} />
      <WhatIsMarkify />
    </>
  );
}
