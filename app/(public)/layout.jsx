import PublicLayout from "@/components/layouts/PublicLayout";
import StructuredData from "@/components/SEO/StructuredData";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";

export default function PublicGroupLayout({ children }) {
  const siteSchemas = [buildOrganizationSchema(), buildWebsiteSchema()];

  return (
    <>
      <StructuredData data={siteSchemas} />
      <PublicLayout>{children}</PublicLayout>
    </>
  );
}
