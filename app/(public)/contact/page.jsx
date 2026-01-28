import Contact from "@/app/(public)/_components/Contact";
import StructuredData from "@/components/SEO/StructuredData";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";

const title = "Contact Support & Sales";
const description =
  "Contact the Markify team for support, partnerships, or enterprise pricing. Send a message and we'll reply within 24 hours.";

export const metadata = buildMetadata({
  title,
  description,
  path: "/contact",
  keywords: ["contact Markify", "Markify support", "Markify help"],
});

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);
  const contactSchema = buildWebPageSchema({
    title,
    description,
    path: "/contact",
    type: "ContactPage",
  });

  return (
    <>
      <StructuredData data={[contactSchema, breadcrumbs]} />
      <Contact />
    </>
  );
}
