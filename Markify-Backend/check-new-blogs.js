require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkNewBlogs() {
    // Check all 10 new differentiation blogs
    const keywords = [
        'Raindrop',
        'Pocket',
        'Researchers',
        'Developers',
        'Browser Bookmarks',
        'Knowledge Base',
        'Ultimate',
        'Students',
        'Why We Built',
        'Notion'
    ];

    console.log('\n=== NEW DIFFERENTIATION BLOGS ===\n');

    for (const keyword of keywords) {
        const post = await prisma.blogPost.findFirst({
            where: { title: { contains: keyword, mode: 'insensitive' } },
            select: { title: true, coverImage: true, published: true }
        });

        if (post) {
            const imgStatus = post.coverImage ? '✅' : '❌ NO IMAGE';
            const pubStatus = post.published ? '📢 PUBLISHED' : '📝 DRAFT';
            console.log(`${imgStatus} ${pubStatus} ${post.title}`);
        }
    }

    const total = await prisma.blogPost.count({ where: { published: false } });
    console.log(`\nTotal drafts: ${total}`);
}

checkNewBlogs().finally(() => prisma.$disconnect());
