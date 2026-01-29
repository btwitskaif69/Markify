import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const blogs = await prisma.blogPost.findMany({
        orderBy: { title: 'asc' },
        select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true,
            published: true
        }
    });

    console.log(JSON.stringify(blogs, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
