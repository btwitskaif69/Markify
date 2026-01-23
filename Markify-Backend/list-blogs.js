require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listBlogs() {
    const posts = await prisma.blogPost.findMany({
        select: { title: true, slug: true }
    });
    console.log('Existing blogs:');
    posts.forEach(p => console.log('- ' + p.title));
    console.log('\nTotal:', posts.length);
}

listBlogs().finally(() => prisma.$disconnect());
