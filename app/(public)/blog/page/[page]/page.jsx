/* eslint-disable react/prop-types */
import Blog from "@/app/(public)/_components/Blog";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo";
import prisma from "@/server/db/prismaClient";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 3600;
export const dynamicParams = true;
export const runtime = "nodejs";

const PAGE_SIZE = 12;

const getPageData = async (pageNumber) => {
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
        skip: (pageNumber - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.blogPost.count({ where: { published: true } }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalPosts / PAGE_SIZE));
    return { posts, totalPages, totalPosts };
  } catch (error) {
    console.warn("Blog pagination fetch failed:", error?.message || error);
    return { posts: [], totalPages: 1, totalPosts: 0 };
  }
};

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const pageNumber = Number(resolvedParams?.page);

  if (!Number.isInteger(pageNumber) || pageNumber < 2) {
    return buildMetadata({
      title: "Bookmarking Tips & Updates",
      description:
        "Read Markify blog posts on bookmark organization, workflow automation, productivity systems, and product updates.",
      path: "/blog",
    });
  }

  const { totalPages } = await getPageData(pageNumber);
  if (pageNumber > totalPages) {
    return buildMetadata({
      title: "Blog page not found",
      description: "The requested blog page could not be found.",
      path: "/blog",
      noindex: true,
      nofollow: true,
    });
  }

  return buildMetadata({
    title: `Blog Page ${pageNumber}`,
    description:
      "Continue exploring Markify blog posts focused on workflows, organization, and comparison guides.",
    path: `/blog/page/${pageNumber}`,
    prevPath: pageNumber === 2 ? "/blog" : `/blog/page/${pageNumber - 1}`,
    nextPath: pageNumber < totalPages ? `/blog/page/${pageNumber + 1}` : undefined,
  });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const pageNumber = Number(resolvedParams?.page);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) return notFound();
  if (pageNumber === 1) return permanentRedirect("/blog");

  const { posts, totalPages } = await getPageData(pageNumber);
  if (pageNumber > totalPages || !posts.length) return notFound();

  const path = `/blog/page/${pageNumber}`;
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: `Page ${pageNumber}`, path },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: `Markify blog page ${pageNumber}`,
    description: "Paginated archive of Markify blog content.",
    path,
    type: "CollectionPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs].filter(Boolean)} />
      <Blog
        initialPosts={posts}
        pagination={{
          currentPage: pageNumber,
          totalPages,
        }}
      />
    </>
  );
}
