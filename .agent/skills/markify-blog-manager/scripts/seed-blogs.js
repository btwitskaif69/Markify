/**
 * Markify Blog Seeder
 * Creates blog posts as drafts in the database
 * 
 * Usage: node scripts/seed-blogs.js
 * Run from Markify-Backend directory
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Add your blog posts here
const blogs = [
    {
        title: "Example Blog Post Title",
        excerpt: "A compelling 150-160 character description with your primary keyword for SEO.",
        content: `# Example Blog Post Title

Your hook goes here - a question, statistic, or bold statement.

The problem you're solving should appear in the first 100 words, along with your primary keyword.

## Why This Matters

Short paragraphs, 3-4 sentences max. Use active voice and second person ("you").

### Key Benefits

- Benefit one with clear value
- Benefit two that solves a pain point
- Benefit three that differentiates

## How to Get Started

Step-by-step guidance here. Include internal links to [Markify features](/features) where relevant.

## Comparison Table

| Feature | Option A | Option B |
|---------|----------|----------|
| Price | $X | $Y |
| Best For | Use case | Use case |

## Conclusion

Summarize the key takeaway. End with a clear CTA.

Ready to try it yourself? [Get started with Markify](/signup) today.

## FAQ

### Question 1?

Concise answer targeting featured snippets.

### Question 2?

Another helpful answer.

### Question 3?

Final answer with value.
`,
        published: false
    }
];

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

async function seedBlogs() {
    console.log("\n📝 Starting blog seeding...\n");

    // Get admin user for author
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" }
    });

    if (!admin) {
        console.error("❌ No admin user found. Create an admin first.");
        return;
    }

    console.log(`👤 Using author: ${admin.name || admin.email}\n`);

    let created = 0;
    let skipped = 0;

    for (const blog of blogs) {
        const slug = generateSlug(blog.title);

        // Check if blog already exists
        const existing = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (existing) {
            console.log(`⏭️  Skipped (exists): ${blog.title}`);
            skipped++;
            continue;
        }

        await prisma.blogPost.create({
            data: {
                title: blog.title,
                slug,
                excerpt: blog.excerpt,
                content: blog.content,
                published: blog.published,
                authorId: admin.id
            }
        });

        console.log(`✅ Created: ${blog.title}`);
        created++;
    }

    console.log(`\n📊 Summary: ${created} created, ${skipped} skipped\n`);
}

seedBlogs()
    .catch((e) => {
        console.error("❌ Error:", e.message);
    })
    .finally(() => prisma.$disconnect());
