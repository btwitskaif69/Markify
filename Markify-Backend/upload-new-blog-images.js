// Script to upload blog cover images to R2 and update database
// Run with: node upload-new-blog-images.js

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

// R2 Configuration from env
const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

// Image directory - where the generated images are stored
const IMAGE_DIR = "C:\\Users\\ziyan\\.gemini\\antigravity\\brain\\d5d26d25-63fd-46af-9a1c-4665462587b9";

// Mapping of blog titles to their cover image files
// These are the 9 NEW blogs created as drafts
const blogImageMap = [
    {
        titleContains: "Top Applications for Organizing Web Links",
        image: "blog_cover_2_1769193390338.png"
    },
    {
        titleContains: "How to Organize Bookmarks Efficiently on Desktop and Mobile",
        image: "blog_cover_3_1769193406303.png"
    },
    {
        titleContains: "Find a Reliable Service to Save and Categorize Web Pages",
        image: "blog_cover_4_1769193424877.png"
    },
    {
        titleContains: "Top Bookmark Managers with Cloud Sync",
        image: "blog_cover_5_1769193441774.png"
    },
    {
        titleContains: "How to Effectively Manage Hundreds of Saved Websites",
        image: "blog_cover_6_1769193471305.png"
    },
    {
        titleContains: "Where to Download a Reliable Bookmark Organizer",
        image: "blog_cover_7_1769193489615.png"
    },
    {
        titleContains: "How to Sync Bookmarks Across All My Devices",
        image: "blog_cover_8_1769193505066.png"
    },
    {
        titleContains: "Best Bookmark Manager with Built-in Search and Tagging",
        image: "blog_cover_9_1769193522539.png"
    },
    {
        titleContains: "Best Browser Extensions for Bookmark Management",
        image: "blog_cover_10_1769193539812.png"
    },
];

async function uploadImageToR2(localPath, key) {
    const fileContent = fs.readFileSync(localPath);
    const contentType = "image/png";

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
    });

    await s3Client.send(command);
    return `${process.env.R2_PUBLIC_URL}/${key}`;
}

async function uploadBlogImages() {
    console.log("🚀 Starting blog cover image upload for NEW drafts...\n");

    for (const { titleContains, image } of blogImageMap) {
        try {
            const localPath = path.join(IMAGE_DIR, image);

            if (!fs.existsSync(localPath)) {
                console.log(`⏭️  Image not found: ${image}`);
                continue;
            }

            // Find the blog post by title
            const post = await prisma.blogPost.findFirst({
                where: {
                    title: { contains: titleContains }
                }
            });

            if (!post) {
                console.log(`⚠️  Blog post not found with title containing: ${titleContains}`);
                continue;
            }

            // Upload to R2
            const r2Key = `blog-covers/${post.slug}.png`;
            console.log(`📤 Uploading ${image} for "${post.title}"...`);
            const publicUrl = await uploadImageToR2(localPath, r2Key);
            console.log(`   URL: ${publicUrl}`);

            // Update database
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { coverImage: publicUrl }
            });

            console.log(`✅ Updated "${post.title}" with cover image\n`);
        } catch (error) {
            console.error(`❌ Error processing "${titleContains}":`, error.message);
        }
    }

    console.log("🎉 Blog image upload complete!");
}

uploadBlogImages()
    .catch((e) => {
        console.error("Upload failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
