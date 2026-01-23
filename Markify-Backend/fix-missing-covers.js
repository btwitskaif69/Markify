require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULT_COVER_IMAGE = "https://assets.markify.tech/assets/markify%20og%20image.png";

async function fixMissingCovers() {
    const blogsToFix = [
        "Markify for Students",
        "Why We Built Markify",
        "Markify vs Notion"
    ];

    console.log("\n🛠️  Fixing missing cover images...\n");

    for (const titleFragment of blogsToFix) {
        const post = await prisma.blogPost.findFirst({
            where: {
                title: { contains: titleFragment }
            }
        });

        if (!post) {
            console.log(`⚠️  Could not find blog containing: "${titleFragment}"`);
            continue;
        }

        if (post.coverImage) {
            console.log(`ℹ️  Blog "${post.title}" already has an image. Skipping.`);
            continue;
        }

        await prisma.blogPost.update({
            where: { id: post.id },
            data: {
                coverImage: DEFAULT_COVER_IMAGE,
                published: true // Also publish it since we're fixing the image
            }
        });

        console.log(`✅ Updated & Published: ${post.title}`);
    }
}

fixMissingCovers().finally(() => prisma.$disconnect());
