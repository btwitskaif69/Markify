import PrivacyPolicy from "@/app/(public)/_components/PrivacyPolicy";
import StructuredData from "@/components/SEO/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Policy for Bookmark Manager Users",
  description:
    "Learn how Markify collects, uses, and protects personal data when you use the bookmark manager and related services.",
  path: "/privacy",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <PrivacyPolicy />
    </>
  );
}
