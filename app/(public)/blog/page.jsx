import Blog from "@/app/(public)/_components/Blog";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo";
import prisma from "@/server/db/prismaClient";

export const revalidate = 3600;
export const runtime = "nodejs";
const PAGE_SIZE = 12;

const getBlogPageCount = async () => {
  try {
    const totalPosts = await prisma.blogPost.count({ where: { published: true } });
    return Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
  } catch (error) {
    console.warn("Blog count failed:", error?.message || error);
    return 1;
  }
};

export const generateMetadata = async () => {
  const totalPages = await getBlogPageCount();
  return buildMetadata({
    title: "Bookmarking Tips & Updates",
    description:
      "Read Markify blog posts on bookmark organization, workflow automation, productivity systems, and product updates for faster link management.",
    path: "/blog",
    nextPath: totalPages > 1 ? "/blog/page/2" : undefined,
  });
};

const getBlogPosts = async ({ page = 1, pageSize = PAGE_SIZE } = {}) => {
  try {
    const [posts, totalPosts] = await Promise.all([
      prisma.blogPost.findMany({
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
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
      prisma.blogPost.count({ where: { published: true } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalPosts / pageSize));
    return { posts, totalPosts, totalPages };
  } catch (error) {
    console.warn("Blog list fetch failed:", error?.message || error);
    return { posts: [], totalPosts: 0, totalPages: 1 };
  }
};

export default async function Page() {
  const { posts, totalPages } = await getBlogPosts({ page: 1 });
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: "Markify Blog",
    description:
      "Read Markify blog posts on bookmark organization, workflow automation, productivity systems, and product updates.",
    path: "/blog",
    type: "CollectionPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs].filter(Boolean)} />
      <Blog
        initialPosts={posts}
        pagination={{
          currentPage: 1,
          totalPages,
        }}
      />
    </>
  );
}
