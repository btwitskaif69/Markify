import ReactPkg from "react";
import prisma from "@/server/db/prismaClient";

const cache = typeof ReactPkg.cache === "function" ? ReactPkg.cache : (fn) => fn;

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const buildAuthorBio = (name) =>
  `${name} contributes practical workflows, implementation notes, and editorial guidance for bookmark organization and team knowledge management.`;

export const getAuthorDirectory = cache(async () => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const map = new Map();
    posts.forEach((post) => {
      const authorId = post.author?.id;
      const authorName = post.author?.name || "Markify Team";
      if (!authorId) return;
      if (!map.has(authorId)) {
        map.set(authorId, {
          id: authorId,
          name: authorName,
          slug: slugify(authorName),
          avatar: post.author?.avatar || null,
          bio: buildAuthorBio(authorName),
          posts: [],
          postCount: 0,
          latestUpdatedAt: post.updatedAt || post.createdAt,
        });
      }
      const current = map.get(authorId);
      current.posts.push({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
      current.postCount += 1;
      if (post.updatedAt && new Date(post.updatedAt) > new Date(current.latestUpdatedAt)) {
        current.latestUpdatedAt = post.updatedAt;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.postCount - a.postCount);
  } catch (error) {
    console.warn("Author directory fetch failed:", error?.message || error);
    return [];
  }
});

export const getAuthorBySlug = cache(async (slug) => {
  if (!slug) return null;
  const directory = await getAuthorDirectory();
  return directory.find((author) => author.slug === slug) || null;
});
