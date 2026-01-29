
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Map of old slugs to new slugs
const slugUpdates = [
    { old: 'best-bookmark-manager-search-tagging', new: 'best-bookmark-manager-with-built-in-search-and-tagging' },
    { old: 'sync-bookmarks-all-devices-2026', new: 'how-to-sync-bookmarks-across-all-my-devices-in-2026' },
    { old: 'download-reliable-bookmark-organizer', new: 'where-to-download-a-reliable-bookmark-organizer-tool' },
    { old: 'manage-hundreds-saved-websites', new: 'how-to-effectively-manage-hundreds-of-saved-websites' },
    { old: 'top-bookmark-managers-cloud-sync-2026', new: 'top-bookmark-managers-with-cloud-sync-features-in-2026' },
    { old: 'reliable-service-save-categorize-web-pages', new: 'find-a-reliable-service-to-save-and-categorize-web-pages' },
    { old: 'organize-bookmarks-desktop-mobile', new: 'how-to-organize-bookmarks-efficiently-on-desktop-and-mobile' },
    { old: 'top-applications-organizing-web-links-2026', new: 'top-applications-for-organizing-web-links-in-2026' },
    { old: 'how-to-manage-x-twitter-bookmarks-in-2026', new: 'how-to-manage-x-twitter-bookmarks-2026' },
    { old: 'best-bookmark-manager-windows-2026', new: 'best-bookmark-manager-for-windows-2026' },
    { old: 'best-bookmark-manager-mac-2026', new: 'best-bookmark-manager-for-mac-2026' },
    { old: 'best-bookmark-manager-android-2026', new: 'best-bookmark-manager-for-android-2026' },
    { old: 'best-bookmark-manager-firefox-2026', new: 'best-bookmark-manager-for-firefox-2026' },
    { old: 'best-bookmark-manager-safari-2026', new: 'best-bookmark-manager-for-safari-2026' },
    { old: 'best-bookmark-manager-chrome-2026', new: 'best-bookmark-manager-for-chrome-2026' },
    { old: 'where-is-bookmark-manager-safari', new: 'where-is-bookmark-manager-in-safari' },
    { old: 'where-is-bookmark-manager-edge', new: 'where-is-bookmark-manager-in-edge' },
    { old: 'where-is-bookmark-manager-chrome-android', new: 'where-is-bookmark-manager-in-chrome-android' },
    { old: 'where-is-bookmark-manager-firefox', new: 'where-is-bookmark-manager-in-firefox' },
    { old: 'digital-decluttering-browser-tabs', new: 'digital-decluttering-how-to-stop-drowning-in-browser-tabs' },
    { old: 'why-we-built-markify', new: 'why-we-built-markify-the-web-deserves-better' },
    { old: 'share-bookmarks-collections-markify', new: 'unlock-collaboration-share-your-bookmarks-and-collections-with-markify' },
    { old: 'why-bookmark-manager-matters-today', new: 'why-a-bookmark-manager-matters-more-today-than-ever-a-practical-guide-to-organizing-your-digital-life' },
    { old: 'markify-simple-online-bookmark-manager', new: 'markify-simple-online-bookmark-manager-for-all-your-links' },
    { old: 'markify-cleaner-digital-life', new: 'why-markify-is-becoming-the-go-to-tool-for-people-who-want-a-cleaner-digital-life' },
    { old: 'markify-redefining-bookmarks', new: 'how-markify-is-redefining-the-way-we-save-and-organize-bookmarks-online' },
    { old: 'how-to-recover-deleted-bookmarks', new: 'recover-deleted-bookmarks' },
    { old: 'bookmark-manager-search-tagging', new: 'bookmark-manager-search-and-tagging' },
    { old: 'bookmark-managers-cloud-sync', new: 'bookmark-managers-with-cloud-sync' },
];

async function main() {
    console.log('Updating blog slugs in database...\n');

    let updated = 0;
    let notFound = 0;

    for (const { old: oldSlug, new: newSlug } of slugUpdates) {
        try {
            const existingBlog = await prisma.blogPost.findUnique({
                where: { slug: oldSlug },
            });

            if (existingBlog) {
                await prisma.blogPost.update({
                    where: { slug: oldSlug },
                    data: { slug: newSlug },
                });
                console.log(`✓ Updated: ${oldSlug} → ${newSlug}`);
                updated++;
            } else {
                // Check if new slug already exists
                const newSlugExists = await prisma.blogPost.findUnique({
                    where: { slug: newSlug },
                });
                if (newSlugExists) {
                    console.log(`⊛ Already updated: ${newSlug}`);
                } else {
                    console.log(`✗ Not found: ${oldSlug}`);
                    notFound++;
                }
            }
        } catch (error) {
            console.error(`Error updating ${oldSlug}:`, error.message);
        }
    }

    console.log(`\n✓ Updated: ${updated}`);
    console.log(`✗ Not found: ${notFound}`);
    console.log('Slug update complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
