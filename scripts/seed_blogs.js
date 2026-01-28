
import { PrismaClient } from '@prisma/client';
import blogs from './blog_data.js';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding blogs...');

    // Find a user to assign as author
    let author = await prisma.user.findFirst();

    if (!author) {
        console.log('No user found. Creating a dummy admin user...');
        author = await prisma.user.create({
            data: {
                name: 'Admin User',
                email: 'admin@markify.com',
                password: 'hashed_password_placeholder', // In a real app, hash this!
                isVerified: true,
            },
        });
    }

    console.log(`Using author: ${author.name} (${author.email})`);

    for (const blog of blogs) {
        const existingBlog = await prisma.blogPost.findUnique({
            where: { slug: blog.slug },
        });

        if (existingBlog) {
            console.log(`Updating blog: ${blog.title}`);
            await prisma.blogPost.update({
                where: { slug: blog.slug },
                data: {
                    title: blog.title,
                    content: blog.content,
                    excerpt: blog.excerpt,
                    coverImage: blog.coverImage,
                    authorId: author.id,
                },
            });
        } else {
            console.log(`Creating blog: ${blog.title}`);
            await prisma.blogPost.create({
                data: {
                    title: blog.title,
                    slug: blog.slug,
                    content: blog.content,
                    excerpt: blog.excerpt,
                    coverImage: blog.coverImage,
                    published: false,
                    authorId: author.id,
                },
            });
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
