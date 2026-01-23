/**
 * Markify Blog Image Uploader
 * Uploads cover images to R2 and updates blog records
 * 
 * Usage: node scripts/upload-blog-images.js
 * Run from Markify-Backend directory
 */

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

// Path to directory containing cover images
const IMAGE_DIR = "C:/path/to/your/images";

// Map blog titles to image filenames
// Use partial title match for flexibility
const blogImageMap = [
    { titleContains: "Example Blog", image: "example_cover.png" },
    // Add more mappings as needed
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
    console.log("\n🖼️  Starting image upload...\n");

    // Verify R2 credentials
    if (!process.env.R2_ACCOUNT_ID || !process.env.R2_ACCESS_KEY_ID) {
        console.error("❌ R2 credentials missing. Check .env file.");
        return;
    }

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
            console.log(`⚠️  Image not found: ${imagePath}`);
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
            console.log(`   ${publicUrl}\n`);
            uploaded++;

        } catch (error) {
            console.log(`❌ Failed: ${post.title}`);
            console.log(`   ${error.message}\n`);
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
