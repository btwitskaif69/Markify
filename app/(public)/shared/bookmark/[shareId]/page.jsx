import SharedBookmark from "@/app/(public)/_components/SharedBookmark";
import StructuredData from "@/components/SEO/StructuredData";
import { API_BASE_URL } from "@/client/lib/apiConfig";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { buildMetadata } from "@/lib/seo/metadata";
import { cache } from "react";

const getSharedBookmark = cache(async (shareId) => {
  if (!shareId) return null;
  try {
    const response = await fetch(
      `${API_BASE_URL}/bookmarks/shared/${shareId}`,
      { cache: "no-store" }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.warn("Shared bookmark fetch failed:", error?.message || error);
    return null;
  }
});

export const generateMetadata = async ({ params }) => {
  const shareId = params.shareId;
  const bookmark = await getSharedBookmark(shareId);
  const path = `/shared/bookmark/${shareId}`;

  if (!bookmark) {
    return buildMetadata({
      title: "Bookmark not found",
      description: "This shared bookmark is no longer available.",
      path,
      noindex: true,
      nofollow: true,
    });
  }

  return buildMetadata({
    title: bookmark.title || "Shared bookmark",
    description:
      bookmark.description ||
      `Shared bookmark from ${bookmark.sharedBy?.name || "a Markify user"}.`,
    path,
    image: bookmark.previewImage,
    noindex: true,
    nofollow: true,
  });
};

export default function Page({ params }) {
  const shareId = params.shareId;
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Shared Bookmark", path: `/shared/bookmark/${shareId}` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <SharedBookmark />
    </>
  );
}
