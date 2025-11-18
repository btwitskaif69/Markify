const prisma = require("../db/prismaClient");

// Utility: basic slug generator from a title
const slugify = (str) =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Ensure slug is unique by appending -1, -2, ...
async function generateUniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let counter = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) return slug;
    slug = `${base}-${counter++}`;
  }
}

exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        author: {
          select: { id: true, name: true },
        },
      },
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load blog posts." });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load post." });
  }
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
      select: { id: true, authorId: true },
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
