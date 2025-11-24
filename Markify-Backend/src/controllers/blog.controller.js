const redis = require("../db/redis");

// ... (existing imports and helpers)

// Helper to clear blog cache
const clearBlogCache = async () => {
  if (!process.env.UPSTASH_REDIS_REST_URL) return;
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

exports.getPublishedPosts = async (req, res) => {
  // ... (existing code)
};

exports.getPostBySlug = async (req, res) => {
  // ... (existing code)
};

exports.createPost = async (req, res) => {
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

exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, excerpt, coverImage, published } = req.body;

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (existing.authorId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to edit this post." });
    }

    let slug = existing.slug;
    if (title && title !== existing.title) {
      slug = await generateUniqueSlug(title);
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
    if (process.env.UPSTASH_REDIS_REST_URL) {
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

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const existing = await prisma.blogPost.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, slug: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (existing.authorId !== req.user.id) {
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

exports.getMyPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { authorId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load your posts." });
  }
};
