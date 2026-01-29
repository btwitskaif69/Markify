import BlogPost from "@/app/(public)/_components/BlogPost";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import prisma from "@/server/db/prismaClient";
import { redirect } from "next/navigation";

export const revalidate = 3600;
export const dynamicParams = true;
export const runtime = "nodejs";

const LEGACY_SLUG_REDIRECTS = {
  "bookmark-manager-search-tagging": "bookmark-manager-search-and-tagging",
};

const getPostBySlug = async (slug) => {
  if (!slug) return { post: null, error: null };
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatar: true },
        },
      },
    });
    return { post, error: null };
  } catch (error) {
    console.warn("Blog post fetch failed:", error?.message || error);
    return { post: null, error };
  }
};

const getLatestPosts = async (slug) => {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true, slug: { not: slug } },
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
      take: 3,
    });
  } catch (error) {
    console.warn("Blog latest fetch failed:", error?.message || error);
    return [];
  }
};

const buildSeoTitle = (title) => {
  if (!title) return "Markify Blog";
  const trimmed = title.trim();
  if (trimmed.length >= 45) return trimmed;
  return `${trimmed} - Bookmarking Tips`;
};

const buildSeoDescription = (excerpt, title) => {
  const fallback = title
    ? `Read ${title} and learn bookmark workflows that keep links organized and easy to find.`
    : "Read the latest Markify updates on saving, organizing, and searching bookmarks.";
  const base = (excerpt || fallback).trim();
  if (base.length >= 120 && base.length <= 170) return base;
  if (base.length < 120) {
    return `${base} Learn how Markify helps you save, organize, and find links faster.`;
  }
  return `${base.slice(0, 157).trimEnd()}...`;
};

export const generateMetadata = async ({ params }) => {
  const { post, error } = await getPostBySlug(params.slug);
  if (!post || !post.published) {
    if (error) {
      return buildMetadata({
        title: "Markify Blog",
        description:
          "Read the latest Markify updates on saving, organizing, and searching bookmarks.",
        path: `/blog/${params.slug || ""}`,
      });
    }
    return buildMetadata({
      title: "Blog post not found",
      description: "The requested blog post could not be found.",
      path: "/blog",
      noindex: true,
      nofollow: true,
    });
  }

  const seoTitle = buildSeoTitle(post.title);
  const seoDescription = buildSeoDescription(post.excerpt, post.title);

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.coverImage,
    publishedTime: post.createdAt?.toISOString?.() || post.createdAt,
    modifiedTime: post.updatedAt?.toISOString?.() || post.updatedAt,
    author: post.author?.name || "Markify Team",
  });
};

export default async function Page({ params }) {
  const { post, error } = await getPostBySlug(params.slug);
  if (!post || !post.published) {
    const redirectSlug = LEGACY_SLUG_REDIRECTS[params.slug];
    if (redirectSlug) {
      return redirect(`/blog/${redirectSlug}`);
    }
    return <BlogPost initialPost={null} initialLatestPosts={[]} />;
  }

  const latestPosts = await getLatestPosts(post.slug);
  const canonicalUrl = getCanonicalUrl(`/blog/${post.slug}`);
  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    url: canonicalUrl,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    authorName: post.author?.name || "Markify Team",
  });
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbs]} />
      <BlogPost initialPost={post} initialLatestPosts={latestPosts} />
    </>
  );
}
