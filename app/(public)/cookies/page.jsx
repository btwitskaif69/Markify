import CookiePolicy from "@/app/(public)/_components/CookiePolicy";
import StructuredData from "@/components/SEO/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Cookie Policy",
  description:
    "Understand how Markify uses cookies for analytics, preferences, and performance in the bookmark manager.",
  path: "/cookies",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Cookie Policy", path: "/cookies" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <CookiePolicy />
    </>
  );
}
