// Script to upload blog cover images to R2 and update database
// Run with: node upload-blog-images.js

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

// Image directory
const IMAGE_DIR = "C:\\Users\\ziyan\\.gemini\\antigravity\\brain\\3d56ea41-1996-487c-a220-cf89b73e04fa";

// Mapping of blog slugs to their cover image files
const blogImageMap = [
    { slug: "best-bookmark-manager-chrome-2026", image: "cover_chrome_1768585260339.png" },
    { slug: "best-bookmark-manager-safari-2026", image: "cover_safari_1768585437907.png" },
    { slug: "best-bookmark-manager-firefox-2026", image: "cover_firefox_1768585474835.png" },
    { slug: "best-bookmark-manager-android-2026", image: "cover_android_1768585505328.png" },
    { slug: "best-bookmark-manager-mac-2026", image: "cover_mac_1768585701925.png" },
    { slug: "best-bookmark-manager-windows-2026", image: "cover_windows_1768585720232.png" },
    { slug: "best-cross-browser-bookmark-manager-2026", image: "cover_cross_browser_1768585740971.png" },
    { slug: "best-new-tab-bookmark-manager-2026", image: "cover_new_tab_1768585931429.png" },
    { slug: "how-to-manage-x-twitter-bookmarks-2026", image: "cover_twitter_x_1768585957614.png" },
    { slug: "best-twitter-bookmark-manager-2026", image: "cover_twitter_x_1768585957614.png" }, // Reuse same image
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
    console.log("🚀 Starting blog cover image upload...\n");

    for (const { slug, image } of blogImageMap) {
        try {
            const localPath = path.join(IMAGE_DIR, image);

            if (!fs.existsSync(localPath)) {
                console.log(`⏭️  Image not found for ${slug}: ${image}`);
                continue;
            }

            // Upload to R2
            const r2Key = `blog-covers/${slug}.png`;
            console.log(`📤 Uploading ${image} to R2...`);
            const publicUrl = await uploadImageToR2(localPath, r2Key);
            console.log(`   URL: ${publicUrl}`);

            // Update database
            const updated = await prisma.blogPost.updateMany({
                where: { slug },
                data: { coverImage: publicUrl }
            });

            if (updated.count > 0) {
                console.log(`✅ Updated ${slug} with cover image\n`);
            } else {
                console.log(`⚠️  Blog post not found: ${slug}\n`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${slug}:`, error.message);
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
