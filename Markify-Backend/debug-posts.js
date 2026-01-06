const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    console.log("Checking recent blog posts...");
    try {
        const posts = await prisma.blogPost.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                title: true,
                published: true,
                createdAt: true,
            },
        });

        let output = "Most recent 5 posts:\n";
        posts.forEach(p => {
            output += `[${p.published ? 'PUBLISHED' : 'DRAFT'}] ${p.title} - ${p.createdAt}\n`;
        });

        fs.writeFileSync('debug_output.txt', output);
        console.log("Output written to debug_output.txt");

    } catch (e) {
        console.error(e);
        fs.writeFileSync('debug_output.txt', "Error: " + e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
