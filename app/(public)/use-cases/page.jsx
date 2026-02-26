import UseCases from "@/app/(public)/_components/UseCases";
import StructuredData from "@/components/SEO/StructuredData";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPseoIntentIndex, getPseoIntentPath } from "@/lib/pseo";

export const metadata = buildMetadata({
  title: "Bookmark Manager Use Cases by Workflow",
  description:
    "Explore Markify use-case workflows by intent to organize research, resources, and team knowledge faster.",
  path: "/use-cases",
});

export default function Page() {
  const intents = getPseoIntentIndex();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: "/use-cases" },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: "Markify use cases",
    description:
      "Explore Markify workflows organized by use-case intent and team goals.",
    path: "/use-cases",
    type: "CollectionPage",
  });
  const itemListSchema = buildItemListSchema(
    intents.map((intent) => ({
      name: intent.title,
      path: getPseoIntentPath(intent.slug),
    })),
    { name: "Use case intents" }
  );

  return (
    <>
      <StructuredData
        data={[webPageSchema, breadcrumbs, itemListSchema].filter(Boolean)}
      />
      <UseCases intents={intents} />
    </>
  );
}
