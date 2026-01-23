// Find the 4 blogs from the screenshot
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function findBlogs() {
    const posts = await prisma.blogPost.findMany({
        where: {
            OR: [
                { title: { contains: "Why a Bookmark Manager Matters" } },
                { title: { contains: "Markify – Simple Online Bookmark Manager" } },
                { title: { contains: "Why Markify Is Becoming the Go-To Tool" } },
                { title: { contains: "How Markify Is Redefining" } },
            ]
        },
        select: { id: true, title: true, slug: true },
    });

    console.log(`\n=== BLOGS TO REWRITE (${posts.length}) ===\n`);
    posts.forEach((p, i) => {
        console.log(`${i + 1}. ${p.title}`);
        console.log(`   ID: ${p.id}`);
        console.log(`   Slug: ${p.slug}\n`);
    });

    await prisma.$disconnect();
}

findBlogs();
