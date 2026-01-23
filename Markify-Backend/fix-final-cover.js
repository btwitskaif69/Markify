require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_COVER_IMAGE = "https://assets.markify.tech/assets/markify%20og%20image.png";

async function fixSpecificBlog() {
    console.log("\n🛠️  Fixing final blog cover...\n");

    const post = await prisma.blogPost.findFirst({
        where: {
            title: { contains: "That Respects Your Time" } // Specific phrase from the new blog
        }
    });

    if (!post) {
        console.log(`⚠️  Could not find the specific 'Why We Built' blog.`);
        return;
    }

    if (post.coverImage) {
        console.log(`ℹ️  Blog "${post.title}" already has an image: ${post.coverImage}`);
    } else {
        await prisma.blogPost.update({
            where: { id: post.id },
            data: {
                coverImage: DEFAULT_COVER_IMAGE,
                published: true
            }
        });
        console.log(`✅ Updated & Published: ${post.title}`);
    }
}

fixSpecificBlog().finally(() => prisma.$disconnect());
