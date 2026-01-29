import { PrismaClient } from '@prisma/client';
import blogs from './blog_data.js';

const prisma = new PrismaClient();

const TARGET_SLUGS = [
    "where-to-download-a-reliable-bookmark-organizer-tool",
    "bookmark-manager-search-and-tagging",
    "organize-bookmarks-efficiently",
    "why-we-built-markify-the-web-deserves-better"
];

function getLocalImage(url) {
    if (!url) return "/blog-images/default.png";
    const filename = url.split('/').pop();
    return `/blog-images/${filename}`;
}

async function main() {
    console.log('Seeding missing drafts...');

    let author = await prisma.user.findFirst();
    if (!author) {
        console.log('No user found for author. Creating default admin...');
        author = await prisma.user.create({
            data: {
                name: 'Admin',
                email: 'admin@markify.com',
                password: 'hash',
                isVerified: true
            }
        });
    }

    const targetBlogs = blogs.filter(b => TARGET_SLUGS.includes(b.slug));

    for (const blog of targetBlogs) {
        // Map to local image
        const localImage = getLocalImage(blog.coverImage);

        // Check if exists
        const existing = await prisma.blogPost.findUnique({
            where: { slug: blog.slug }
        });

        if (existing) {
            console.log(`Updating existing draft: ${blog.title}`);
            await prisma.blogPost.update({
                where: { slug: blog.slug },
                data: {
                    title: blog.title,
                    content: blog.content,
                    excerpt: blog.excerpt,
                    coverImage: localImage,
                    published: false, // Draft
                    authorId: author.id
                }
            });
        } else {
            console.log(`Creating new draft: ${blog.title}`);
            await prisma.blogPost.create({
                data: {
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    excerpt: blog.excerpt,
                    coverImage: localImage,
                    published: false, // Draft
                    authorId: author.id
                }
            });
        }
    }

    console.log(`Processed ${targetBlogs.length} blogs.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
