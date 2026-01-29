import Blog from "@/app/(public)/_components/Blog";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo";
import prisma from "@/server/db/prismaClient";

export const revalidate = 3600;
export const runtime = "nodejs";

export const generateMetadata = () =>
  buildMetadata({
    title: "Bookmarking Tips & Updates",
    description:
      "Read the latest bookmark management tips, product updates, and workflow ideas from the Markify team.",
    path: "/blog",
  });

const getBlogPosts = async () => {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        author: {
          select: { name: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Blog list fetch failed:", error?.message || error);
    return [];
  }
};

export default async function Page() {
  const posts = await getBlogPosts();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);

  return (
    <>
      <StructuredData data={breadcrumbs} />
      <Blog initialPosts={posts} />
    </>
  );
}
