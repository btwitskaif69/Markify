// Fix missing cover images for draft blogs
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

const IMAGE_DIR = "C:\\Users\\ziyan\\.gemini\\antigravity\\brain\\d5d26d25-63fd-46af-9a1c-4665462587b9";

// Map the 3 missing draft blogs to their images
const missingImageMap = [
    {
        slug: "where-to-download-a-reliable-bookmark-organizer-tool",
        image: "blog_cover_7_1769193489615.png"
    },
    {
        slug: "top-bookmark-managers-with-cloud-sync-features-in-2026",
        image: "blog_cover_5_1769193441774.png"
    },
    {
        slug: "how-to-organize-bookmarks-efficiently-on-desktop-and-mobile",
        image: "blog_cover_3_1769193406303.png"
    },
];

async function uploadImageToR2(localPath, key) {
    const fileContent = fs.readFileSync(localPath);
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: "image/png",
    });
    await s3Client.send(command);
    return `${process.env.R2_PUBLIC_URL}/${key}`;
}

async function fixMissingImages() {
    console.log("🔧 Fixing missing cover images...\n");

    for (const { slug, image } of missingImageMap) {
        try {
            const localPath = path.join(IMAGE_DIR, image);

            if (!fs.existsSync(localPath)) {
                console.log(`⏭️  Image not found: ${image}`);
                continue;
            }

            // Upload to R2
            const r2Key = `blog-covers/${slug}.png`;
            console.log(`📤 Uploading ${image}...`);
            const publicUrl = await uploadImageToR2(localPath, r2Key);
            console.log(`   URL: ${publicUrl}`);

            // Update database by slug
            const updated = await prisma.blogPost.updateMany({
                where: { slug },
                data: { coverImage: publicUrl }
            });

            if (updated.count > 0) {
                console.log(`✅ Fixed: ${slug}\n`);
            } else {
                console.log(`⚠️  Blog not found: ${slug}\n`);
            }
        } catch (error) {
            console.error(`❌ Error: ${slug}:`, error.message);
        }
    }

    console.log("🎉 Done!");
}

fixMissingImages()
    .catch(e => console.error("Failed:", e))
    .finally(() => prisma.$disconnect());
