/**
 * Markify Blog Status Checker
 * Lists all blogs and their image status
 * 
 * Usage: node scripts/check-blogs.js
 * Run from Markify-Backend directory
 */

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkBlogs() {
    console.log("\n📋 Checking blog status...\n");

    // Get all draft blogs
    const drafts = await prisma.blogPost.findMany({
        where: { published: false },
        select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    });

    // Get all published blogs
    const published = await prisma.blogPost.findMany({
        where: { published: true },
        select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    });

    // Display drafts
    console.log(`=== DRAFTS (${drafts.length}) ===\n`);
    if (drafts.length === 0) {
        console.log("No draft blogs found.\n");
    } else {
        drafts.forEach((post, i) => {
            const imageStatus = post.coverImage ? "✅" : "❌ NO IMAGE";
            console.log(`${i + 1}. ${imageStatus} ${post.title}`);
            console.log(`   Slug: ${post.slug}`);
            if (post.coverImage) {
                console.log(`   Image: ${post.coverImage}`);
            }
            console.log();
        });
    }

    // Display published
    console.log(`=== PUBLISHED (${published.length}) ===\n`);
    if (published.length === 0) {
        console.log("No published blogs found.\n");
    } else {
        published.forEach((post, i) => {
            const imageStatus = post.coverImage ? "✅" : "❌ NO IMAGE";
            console.log(`${i + 1}. ${imageStatus} ${post.title}`);
        });
        console.log();
    }

    // Summary
    const draftsWithImages = drafts.filter(p => p.coverImage).length;
    const publishedWithImages = published.filter(p => p.coverImage).length;

    console.log("=== SUMMARY ===\n");
    console.log(`Drafts: ${draftsWithImages}/${drafts.length} have images`);
    console.log(`Published: ${publishedWithImages}/${published.length} have images`);
    console.log(`Total: ${drafts.length + published.length} blogs\n`);
}

checkBlogs()
    .catch((e) => {
        console.error("❌ Error:", e.message);
    })
    .finally(() => prisma.$disconnect());
