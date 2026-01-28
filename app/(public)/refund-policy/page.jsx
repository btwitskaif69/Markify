import RefundPolicy from "@/app/(public)/_components/RefundPolicy";
import StructuredData from "@/components/seo/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Bookmark Manager Refund Policy",
  description:
    "Learn about Markify refunds and cancellations for bookmark manager subscriptions and billing.",
  path: "/refund-policy",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Refund Policy", path: "/refund-policy" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <RefundPolicy />
    </>
  );
}
