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

// Path to generated images
const IMAGE_DIR = "C:/Users/ziyan/.gemini/antigravity/brain/d5d26d25-63fd-46af-9a1c-4665462587b9";

// Map blog titles to image files
const blogImageMap = [
    { titleContains: "Markify vs Raindrop", image: "blog_markify_vs_raindrop_1769198012798.png" },
    { titleContains: "Markify vs Pocket", image: "blog_markify_vs_pocket_1769198034461.png" },
    { titleContains: "Best Bookmark Manager for Researchers", image: "blog_markify_researchers_1769198051460.png" },
    { titleContains: "5 Reasons Developers", image: "blog_markify_developers_1769198081118.png" },
    { titleContains: "vs Browser Bookmarks", image: "blog_browser_bookmarks_1769198098218.png" },
    { titleContains: "Personal Knowledge Base", image: "blog_knowledge_base_1769198125395.png" },
    { titleContains: "Ultimate Bookmark Manager Comparison", image: "blog_comparison_tools_1769198140388.png" },
];

async function uploadImage(localPath, key) {
    const fileBuffer = fs.readFileSync(localPath);

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: "image/png",
    });

    await s3Client.send(command);
    return `${process.env.R2_PUBLIC_URL}/${key}`;
}

async function main() {
    console.log("\n🖼️  Uploading differentiation blog images...\n");

    let uploaded = 0;
    let failed = 0;

    for (const mapping of blogImageMap) {
        const { titleContains, image } = mapping;

        // Find matching blog post
        const post = await prisma.blogPost.findFirst({
            where: {
                title: { contains: titleContains, mode: "insensitive" }
            }
        });

        if (!post) {
            console.log(`⚠️  No post found matching: "${titleContains}"`);
            failed++;
            continue;
        }

        const imagePath = path.join(IMAGE_DIR, image);

        if (!fs.existsSync(imagePath)) {
            console.log(`⚠️  Image not found: ${image}`);
            failed++;
            continue;
        }

        try {
            // Upload to R2
            const r2Key = `blog-covers/${post.slug}.png`;
            const publicUrl = await uploadImage(imagePath, r2Key);

            // Update blog post
            await prisma.blogPost.update({
                where: { id: post.id },
                data: { coverImage: publicUrl }
            });

            console.log(`✅ Uploaded: ${post.title}`);
            uploaded++;

        } catch (error) {
            console.log(`❌ Failed: ${post.title}`);
            console.log(`   ${error.message}`);
            failed++;
        }
    }

    console.log(`\n📊 Summary: ${uploaded} uploaded, ${failed} failed\n`);
}

main()
    .catch((e) => {
        console.error("❌ Error:", e.message);
    })
    .finally(() => prisma.$disconnect());
