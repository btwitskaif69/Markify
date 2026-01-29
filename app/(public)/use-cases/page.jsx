import UseCases from "@/app/(public)/_components/UseCases";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getPseoHubPath,
  getPseoIntentIndex,
  getPseoIntentPath,
} from "@/lib/pseo";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";

export const revalidate = 86400;

export const generateMetadata = () =>
  buildMetadata({
    title: "Bookmark Manager Use Cases by Intent",
    description:
      "Browse Markify use cases organized by intent and industry to see how teams organize research, content, and knowledge with fast bookmarks.",
    path: getPseoHubPath(),
    keywords: [
      "use cases",
      "programmatic seo",
      "industry workflows",
      "bookmark manager",
    ],
  });

export default function Page() {
  const intents = getPseoIntentIndex();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: getPseoHubPath() },
  ]);
  const itemListSchema = buildItemListSchema(
    intents.map((intent) => ({
      name: intent.title,
      path: getPseoIntentPath(intent.slug),
    })),
    { name: "Markify use cases" }
  );
  const webPageSchema = buildWebPageSchema({
    title: "Markify use cases",
    description:
      "Programmatic SEO workflows organized by intent and industry.",
    path: getPseoHubPath(),
    type: "CollectionPage",
  });
  const structuredData = [webPageSchema, breadcrumbs, itemListSchema].filter(Boolean);

  return (
    <>
      <StructuredData data={structuredData} />
      <UseCases intents={intents} />
    </>
  );
}
