import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TARGET_TITLES = [
  "Markify vs Notion for Bookmarks: When Simpler Is Better",
  "Why We Built Markify: A Bookmark Manager That Respects Your Time",
  "Markify for Students: Organize Research Without the Chaos",
  "The Ultimate Bookmark Manager Comparison: Markify vs 5 Popular Tools",
  "How to Build a Personal Knowledge Base with Markify",
  "Markify vs Browser Bookmarks: Why Built-in Bookmarks Aren't Enough",
  "5 Reasons Developers Choose Markify Over Browser Bookmarks",
  "Why Markify Is the Best Bookmark Manager for Researchers in 2026",
  "Markify vs Pocket: Bookmark Manager vs Read-it-later App",
  "Markify vs Raindrop.io: Which Bookmark Manager Is Right for You",
  "Best Browser Extensions for Bookmark Management in 2026",
  "Best Bookmark Manager with Built-in Search and Tagging",
  "How to Sync Bookmarks Across All My Devices in 2026",
  "Where to Download a Reliable Bookmark Organizer Tool",
  "How to Effectively Manage Hundreds of Saved Websites",
  "Top Bookmark Managers with Cloud Sync Features in 2026",
  "Find a Reliable Service to Save and Categorize Web Pages",
  "How to Organize Bookmarks Efficiently on Desktop and Mobile",
  "Top Applications for Organizing Web Links in 2026",
  "Best Twitter Bookmark Manager 2026",
  "How to Manage X (Twitter) Bookmarks 2026",
  "Best New Tab Bookmark Manager 2026",
  "Best Cross-browser Bookmark Manager 2026",
  "Best Bookmark Manager for Windows 2026",
  "Best Bookmark Manager for Mac 2026",
  "Best Bookmark Manager for Android 2026",
  "Best Bookmark Manager for Firefox 2026",
  "Best Bookmark Manager for Safari 2026",
  "Best Bookmark Manager for Chrome 2026",
  "Recover Deleted Bookmarks",
  "Bookmark Managers for Collaboration",
  "Secure Bookmark Manager Apps",
  "Export/Import Bookmarks Guide",
  "Compare Bookmark Extensions",
  "Bookmark Manager Search & Tagging",
  "Download a Reliable Bookmark Organizer",
  "Bookmark Managers with Cloud Sync",
  "Organize Bookmarks Efficiently",
  "Top Bookmark Managers 2025",
  "Where Is Bookmark Manager in Safari",
  "Where Is Bookmark Manager in Edge",
  "Where Is Bookmark Manager in Chrome Android",
  "Where Is Bookmark Manager in Firefox",
  "How to Access Chrome Bookmark Manager",
  "Finding Chrome Bookmark Manager",
  "Digital Decluttering: How to Stop Drowning in Browser Tabs",
  "Why We Built Markify: The Web Deserves Better",
  "Unlock Collaboration: Share Your Bookmarks & Collections with Markify",
  "Why a Bookmark Manager Matters More Today Than Ever: A Practical Guide to Organizing Your Digital Life",
  "Markify: Simple Online Bookmark Manager for All Your Links",
  "Why Markify Is Becoming the Go-to Tool for People Who Want a Cleaner Digital Life",
  "How Markify Is Redefining the Way We Save and Organize Bookmarks Online",
];

// Titles to skip because the topic was removed or merged.
// Remove items here if you want them processed again.
const SKIP_TITLES = [
  "Why We Built Markify: A Bookmark Manager That Respects Your Time",
  "Download a Reliable Bookmark Organizer",
];

// If an existing post uses a different title for the same topic, map it here.
const TITLE_ALIASES = new Map([
  [
    "How to Manage X (Twitter) Bookmarks 2026",
    ["How to Manage X (Twitter) Bookmarks in 2026"],
  ],
  ["Recover Deleted Bookmarks", ["How to Recover Deleted Bookmarks"]],
  [
    "Markify vs Browser Bookmarks: Why Built-in Bookmarks Aren't Enough",
    ["Markify vs Browser Bookmarks: Why Built-in Bookmarks Aren’t Enough"],
  ],
]);

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

async function main() {
  console.log("Normalizing blog titles/slugs in database...\n");

  let updated = 0;
  let notFound = 0;
  let conflicts = 0;

  const activeTitles = TARGET_TITLES.filter(
    (title) => !SKIP_TITLES.includes(title)
  );

  for (const title of activeTitles) {
    const desiredSlug = slugify(title);
    const aliasTitles = TITLE_ALIASES.get(title) || [];
    try {
      const existingBlog = await prisma.blogPost.findFirst({
        where: {
          OR: [
            { slug: desiredSlug },
            { title: { equals: title, mode: "insensitive" } },
            ...aliasTitles.map((alias) => ({
              title: { equals: alias, mode: "insensitive" },
            })),
          ],
        },
      });

      if (!existingBlog) {
        console.log(`- Not found: ${title}`);
        notFound++;
        continue;
      }

      const slugConflict = await prisma.blogPost.findUnique({
        where: { slug: desiredSlug },
      });

      if (slugConflict && slugConflict.id !== existingBlog.id) {
        console.log(`! Slug conflict: ${desiredSlug} already used by another post.`);
        conflicts++;
        continue;
      }

      await prisma.blogPost.update({
        where: { id: existingBlog.id },
        data: {
          title,
          slug: desiredSlug,
        },
      });

      const before = existingBlog.slug || existingBlog.title;
      console.log(`✓ Updated: ${before} -> ${desiredSlug}`);
      updated++;
    } catch (error) {
      console.error(`Error updating ${title}:`, error.message);
    }
  }

  console.log(`\n✓ Updated: ${updated}`);
  console.log(`- Not found: ${notFound}`);
  console.log(`! Conflicts: ${conflicts}`);
  console.log("Slug/title normalization complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
