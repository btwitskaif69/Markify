import CookieSettings from "@/app/(public)/_components/CookieSettings";
import StructuredData from "@/components/seo/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Manage Cookie Settings",
  description:
    "Update cookie preferences for the Markify bookmark manager, including analytics and marketing choices.",
  path: "/cookie-settings",
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Cookie Settings", path: "/cookie-settings" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <CookieSettings />
    </>
  );
}
