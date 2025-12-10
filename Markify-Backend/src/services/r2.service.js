const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

// Lazy initialization of S3 client to ensure env vars are loaded
let s3Client = null;

function getS3Client() {
    if (!s3Client) {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

        s3Client = new S3Client({
            region: "auto",
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            forcePathStyle: true,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
            },
        });
    }
    return s3Client;
}

/**
 * Uploads an image to Cloudflare R2
 * @param {string} base64Data - The base64 encoded image data (with or without data URI prefix)
 * @param {string} fileName - The desired file name (without extension)
 * @param {string} folder - The folder to upload to (default: "avatars")
 * @returns {Promise<string>} - The public URL of the uploaded image
 */
async function uploadImage(base64Data, fileName, folder = "avatars") {
    // Extract the actual base64 data and content type
    let contentType = "image/png";
    let base64Content = base64Data;

    if (base64Data.includes(",")) {
        const [header, content] = base64Data.split(",");
        base64Content = content;
        const match = header.match(/data:([^;]+);/);
        if (match) {
            contentType = match[1];
        }
    }

    // Get file extension from content type
    const extension = contentType.split("/")[1] || "png";
    const fullFileName = `${folder}/${fileName}.${extension}`;

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Content, "base64");

    // Upload to R2
    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fullFileName,
        Body: buffer,
        ContentType: contentType,
    });

    await getS3Client().send(command);

    // Return the public URL
    return `${process.env.R2_PUBLIC_URL}/${fullFileName}`;
}

/**
 * Deletes an image from Cloudflare R2
 * @param {string} imageUrl - The full URL of the image to delete
 */
async function deleteImage(imageUrl) {
    if (!imageUrl || !process.env.R2_PUBLIC_URL) return;

    try {
        // Extract the key from the URL
        const key = imageUrl.replace(`${process.env.R2_PUBLIC_URL}/`, "");

        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });

        await getS3Client().send(command);
    } catch (error) {
        console.error("Failed to delete image from R2:", error);
    }
}

module.exports = {
    uploadImage,
    deleteImage,
};
