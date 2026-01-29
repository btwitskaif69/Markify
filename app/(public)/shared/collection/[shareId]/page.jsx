import SharedCollection from "@/app/(public)/_components/SharedCollection";
import StructuredData from "@/components/SEO/StructuredData";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { cache } from "react";

const getSharedCollection = cache(async (shareId) => {
  if (!shareId) return null;
  try {
    const response = await fetch(
      `${API_BASE_URL}/collections/shared/${shareId}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("Shared collection fetch failed:", error?.message || error);
    return null;
  }
});

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const shareId = resolvedParams?.shareId;
  const collection = await getSharedCollection(shareId);
  const path = `/shared/collection/${shareId}`;

  if (!collection) {
    return buildMetadata({
      title: "Collection not found",
      description: "This shared collection is no longer available.",
      path,
      noindex: true,
      nofollow: true,
    });
  }

  return buildMetadata({
    title: collection.name || "Shared collection",
    description:
      collection.description ||
      `Shared collection from ${collection.sharedBy?.name || "a Markify user"}.`,
    path,
    noindex: true,
    nofollow: true,
  });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const shareId = resolvedParams?.shareId;
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shared Collection", path: `/shared/collection/${shareId}` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <SharedCollection />
    </>
  );
}
