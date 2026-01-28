
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import blogs from './blog_data.js';
import { uploadImage } from '../server/services/r2.service.js';

// dotenv usage removed in favor of node --env-file


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadBlogImages() {
    console.log("Starting batch upload of blog images to R2...");
    const publicDir = path.join(__dirname, '..', 'public');

    const updatedBlogs = [];

    for (const blog of blogs) {
        // Check if image is already a remote URL
        if (blog.coverImage.startsWith('http')) {
            console.log(`Skipping ${blog.slug}: Image already remote (${blog.coverImage})`);
            updatedBlogs.push(blog);
            continue;
        }

        const localPath = path.join(publicDir, blog.coverImage);

        if (!fs.existsSync(localPath)) {
            console.warn(`Warning: Image not found for ${blog.slug} at ${localPath}`);
            updatedBlogs.push(blog);
            continue;
        }

        try {
            console.log(`Uploading image for ${blog.slug}...`);
            const fileBuffer = fs.readFileSync(localPath);
            const base64Data = fileBuffer.toString('base64');
            const fileName = path.basename(blog.coverImage, path.extname(blog.coverImage));

            // Upload to 'blog-covers' folder in R2
            // Passing MIME type prefix to ensure r2 service handles it correctly if it expects data URI
            const mimeType = 'image/png'; // Assuming png based on directory listing
            const dataUri = `data:${mimeType};base64,${base64Data}`;

            const publicUrl = await uploadImage(dataUri, fileName, 'blog-covers');

            console.log(`✅ Uploaded: ${publicUrl}`);

            updatedBlogs.push({
                ...blog,
                coverImage: publicUrl
            });

        } catch (error) {
            console.error(`❌ Failed to upload image for ${blog.slug}:`, error);
            updatedBlogs.push(blog);
        }
    }

    // Write updated data back to blog_data.js
    const fileContent = `
const blogs = ${JSON.stringify(updatedBlogs, null, 4)};

export default blogs;
`;

    fs.writeFileSync(path.join(__dirname, 'blog_data.js'), fileContent);
    console.log("Updated blog_data.js with new R2 URLs.");
}

uploadBlogImages().catch(console.error);
