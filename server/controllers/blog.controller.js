import redis from "../db/redis";
import prisma from "../db/prismaClient";
import { deleteImage } from "../services/r2.service.js";

// ... (existing imports and helpers)

const clearBlogCache = async () => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !redis) return;
  try {
    // We need to clear the list of posts
    // Since our cache key is dynamic (cache:/api/blog), we can try to delete that specific key
    // In a real app with pagination, we might need to delete 'cache:/api/blog*' using scan
    await redis.del("cache:/api/blog");
    console.log("Cleared blog cache");
  } catch (err) {
    console.error("Failed to clear blog cache:", err);
  }
};

// Helper: Generate Unique Slug
const generateUniqueSlug = async (title) => {
  let slug = title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/(^-|-$)+/g, ""); // Remove leading/trailing hyphens

  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};

export const getPublishedPosts = async (req, res) => {
  try {
    // Only select fields needed for the blog list (exclude heavy content field)
    const posts = await prisma.blogPost.findMany({
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
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts.", error: error.message });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { name: true, avatar: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Failed to fetch post." });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, coverImage, published = true } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required." });
    }

    const slug = await generateUniqueSlug(title);

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.slice(0, 180),
        coverImage: coverImage || null,
        published,
        slug,
        authorId: req.user.id,
      },
    });

    // Invalidate cache
    await clearBlogCache();

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create post." });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, excerpt, coverImage, published } = req.body;

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (existing.authorId !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed to edit this post." });
    }

    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = await generateUniqueSlug(title);
    }

    // Delete old cover image from R2 if a new one is being uploaded
    if (coverImage && existing.coverImage && coverImage !== existing.coverImage) {
      // Only delete if the old image is on our R2 bucket
      if (existing.coverImage.includes(process.env.R2_PUBLIC_URL)) {
        await deleteImage(existing.coverImage);
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id: postId },
      data: {
        title: title ?? existing.title,
        content: content ?? existing.content,
        excerpt:
          excerpt ??
          existing.excerpt ??
          (content ? content.slice(0, 180) : undefined),
        coverImage: coverImage ?? existing.coverImage,
        published:
          typeof published === "boolean" ? published : existing.published,
        slug,
      },
    });

    // Invalidate cache
    await clearBlogCache();
    // Also invalidate individual post cache if we cached by slug (optional, if we add that later)
    if (process.env.UPSTASH_REDIS_REST_URL && redis) {
      await redis.del(`cache:/api/blog/${existing.slug}`);
      if (slug !== existing.slug) {
        await redis.del(`cache:/api/blog/${slug}`);
      }
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update post." });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, slug: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (existing.authorId !== req.user.id && !req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post." });
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    // Invalidate cache
    await clearBlogCache();
    if (process.env.UPSTASH_REDIS_REST_URL) {
      await redis.del(`cache:/api/blog/${existing.slug}`);
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete post." });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: req.user.isAdmin ? undefined : { authorId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    console.log(`Fetched ${posts.length} posts for user ${req.user.id}`);
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load your posts." });
  }
};

export const bulkUpdatePosts = async (req, res) => {
  try {
    const { ids, data } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No post IDs provided." });
    }

    // Only admin can bulk update for now
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized bulk action." });
    }

    await prisma.blogPost.updateMany({
      where: {
        id: { in: ids },
      },
      data: data,
    });

    await clearBlogCache();

    res.status(200).json({ message: "Posts updated successfully." });
  } catch (error) {
    console.error("Bulk update error:", error);
    res.status(500).json({ message: "Failed to update posts." });
  }
};
