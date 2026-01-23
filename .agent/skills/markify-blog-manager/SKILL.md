---
name: markify-blog-manager
description: Create, manage, and publish blog posts for Markify. Use when user asks to "create blog", "write blog post", "upload blog images", "draft blogs", "seed blogs", "generate blog content", or manage blog posts via scripts. Handles content creation, cover image generation, R2 upload, and database drafting.
---

# Markify Blog Manager

This skill manages the complete blog creation workflow for Markify: writing content, generating images, uploading to R2, and drafting to the database.

## Quick Reference

| Task | Script |
|------|--------|
| Create draft blogs | `node scripts/seed-blogs.js` |
| Upload cover images | `node scripts/upload-blog-images.js` |
| Check blog status | `node scripts/check-blogs.js` |

## Workflow Overview

### 1. Content Creation

Write SEO-optimized blog content following these rules:

**Structure:**
```markdown
# [Title with Primary Keyword]

[Hook: question, statistic, or bold statement]

[Problem statement in first 100 words]

## Main Section 1
### Subsection (if needed)

## Main Section 2

## Comparison Table (if applicable)

## Conclusion with CTA

## FAQ (3-5 questions for rich snippets)
```

**Writing Rules:**
- Short paragraphs (3-4 sentences max)
- Active voice, second person ("you")
- Primary keyword in first 100 words and H2s
- No AI slop phrases ("dive in", "game-changer", "seamlessly")
- Include internal links to markify.tech pages
- End with clear CTA

### 2. Image Generation

Generate cover images using the `generate_image` tool with prompts like:

```
Modern digital illustration for blog about [topic]. 
Clean gradient background, abstract tech elements, 
professional SaaS aesthetic, 16:9 aspect ratio.
```

Save images to a known location for upload script.

### 3. Database Drafting

Use `scripts/seed-blogs.js` to create blog posts:

```javascript
// Example blog object structure
{
  title: "Blog Title Here",
  slug: "auto-generated-or-custom",
  excerpt: "150-160 char SEO description",
  content: `Full markdown content...`,
  coverImage: null, // Set after upload
  published: false  // Draft mode
}
```

### 4. Image Upload

Use `scripts/upload-blog-images.js` to:
1. Upload local images to Cloudflare R2
2. Update blog records with public URLs

## Scripts

### seed-blogs.js

Creates blog posts in the database.

**Location:** `Markify-Backend/scripts/seed-blogs.js`

**Usage:**
```bash
cd Markify-Backend
node scripts/seed-blogs.js
```

**Template:**
```javascript
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const blogs = [
  {
    title: "Blog Title",
    excerpt: "SEO description under 160 chars",
    content: `# Markdown content here...`,
    published: false
  }
];

async function seed() {
  for (const blog of blogs) {
    const slug = blog.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    
    await prisma.blogPost.create({
      data: { ...blog, slug, authorId: "ADMIN_USER_ID" }
    });
    console.log(`Created: ${blog.title}`);
  }
}

seed().finally(() => prisma.$disconnect());
```

### upload-blog-images.js

Uploads images to R2 and updates blog records.

**Location:** `Markify-Backend/scripts/upload-blog-images.js`

**Template:**
```javascript
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const IMAGE_DIR = "path/to/generated/images";

// Map blog titles/slugs to image files
const blogImageMap = [
  { titleContains: "Blog Title", image: "cover_image.png" }
];

async function uploadImage(localPath, key) {
  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fs.readFileSync(localPath),
    ContentType: "image/png",
  });
  await s3Client.send(command);
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

async function main() {
  for (const { titleContains, image } of blogImageMap) {
    const post = await prisma.blogPost.findFirst({
      where: { title: { contains: titleContains } }
    });
    
    if (!post) continue;
    
    const url = await uploadImage(
      path.join(IMAGE_DIR, image),
      `blog-covers/${post.slug}.png`
    );
    
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { coverImage: url }
    });
    
    console.log(`Updated: ${post.title}`);
  }
}

main().finally(() => prisma.$disconnect());
```

### check-blogs.js

Check blog status and missing images.

**Template:**
```javascript
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const posts = await prisma.blogPost.findMany({
    where: { published: false },
    select: { title: true, slug: true, coverImage: true }
  });
  
  console.log(`\n=== DRAFT BLOGS (${posts.length}) ===\n`);
  posts.forEach(p => {
    const status = p.coverImage ? "✅" : "❌ NO IMAGE";
    console.log(`${status} ${p.title}`);
  });
}

check().finally(() => prisma.$disconnect());
```

## Environment Variables Required

```env
# R2 Storage
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=markify-assets
R2_PUBLIC_URL=https://assets.markify.tech

# Database
DATABASE_URL=your_database_url
```

## Common Tasks

### Create Multiple Blogs at Once

1. Write content for all blogs in seed script
2. Run `node seed-blogs.js`
3. Generate images with `generate_image` tool
4. Update upload script with image mappings
5. Run `node upload-blog-images.js`
6. Verify with `node check-blogs.js`

### Update Existing Blog Content

```javascript
await prisma.blogPost.update({
  where: { slug: "blog-slug" },
  data: {
    content: `New content...`,
    excerpt: "New excerpt"
  }
});
```

### Publish Drafts

```javascript
await prisma.blogPost.updateMany({
  where: { published: false },
  data: { published: true }
});
```

## SEO Checklist

Before publishing any blog:

- [ ] Title has primary keyword (under 60 chars)
- [ ] Excerpt is 150-160 chars with keyword
- [ ] First 100 words contain primary keyword
- [ ] At least one H2 contains primary keyword
- [ ] Paragraphs are 3-4 sentences max
- [ ] Includes FAQ section (3-5 questions)
- [ ] Has internal links to /features, /solutions, /pricing
- [ ] Cover image is uploaded and displays correctly
- [ ] No AI slop phrases used
