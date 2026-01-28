import TermsOfService from "@/app/(public)/_components/TermsOfService";
import StructuredData from "@/components/SEO/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Terms of Service",
  description:
    "Read the terms and conditions for using Markify's bookmark manager, accounts, and subscriptions.",
  path: "/terms",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms of Service", path: "/terms" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <TermsOfService />
    </>
  );
}
