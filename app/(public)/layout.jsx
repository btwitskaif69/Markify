import PublicLayout from "@/components/layouts/PublicLayout";
import StructuredData from "@/components/seo/StructuredData";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo";

export default function PublicGroupLayout({ children }) {
  const siteSchemas = [buildOrganizationSchema(), buildWebsiteSchema()];

  return (
    <PublicLayout>
      <StructuredData data={siteSchemas} />
      {children}
    </PublicLayout>
  );
}
