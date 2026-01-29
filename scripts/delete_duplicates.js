import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TITLES_TO_DELETE = [
    "Unlock Collaboration: Share Your Bookmarks Collections with Markify",
    "Bookmark Managers Cloud Sync",
    "Best Bookmark Manager Chrome 2026",
    "Best Bookmark Manager Safari 2026",
    "Best Bookmark Manager Firefox 2026",
    "Best Bookmark Manager Android 2026",
    "Best Bookmark Manager Mac 2026",
    "Best Bookmark Manager Windows 2026",
    "Bookmark Manager Search Tagging",
    "Bookmark Manager Search & Tagging",
    "Why We Built Markify: The Web Deserves Better",
    "Where to Download a Reliable Bookmark Organizer Tool"
];

const DUPLICATE_TITLES_TO_CHECK = [
    "Markify vs Browser Bookmarks: Why Built-in Bookmarks Aren't Enough"
];

async function main() {
    console.log('Starting duplicate cleanup...');

    // 1. Delete by Title (Exact Match of "Bad" titles)
    const deletedBad = await prisma.blogPost.deleteMany({
        where: {
            title: { in: TITLES_TO_DELETE }
        }
    });
    console.log(`Deleted ${deletedBad.count} blogs with 'bad' titles.`);

    // 2. Handle Exact Duplicates (Delete Older)
    for (const title of DUPLICATE_TITLES_TO_CHECK) {
        const blogs = await prisma.blogPost.findMany({
            where: { title: title },
            orderBy: { createdAt: 'desc' } // Newest first
        });

        if (blogs.length > 1) {
            console.log(`Found ${blogs.length} copies of "${title}". Keeping newest.`);
            const [newest, ...others] = blogs;

            for (const blog of others) {
                await prisma.blogPost.delete({ where: { id: blog.id } });
                console.log(`Deleted older copy: ${blog.id} (${blog.createdAt})`);
            }
        }
    }

    console.log('Cleanup finished.');
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
