/**
 * Seed 30 high-quality reviews into the database.
 * Creates fake reviewer users and attaches APPROVED reviews.
 *
 * Usage: node scripts/seed-reviews.mjs
 */

import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

const reviews = [
    {
        name: "Sarah Mitchell",
        rating: 5,
        content:
            "Markify completely transformed how I manage my research. I used to lose track of important articles across dozens of browser tabs — now everything is tagged, searchable, and beautifully organized. The Chrome extension makes saving bookmarks effortless.",
    },
    {
        name: "James Rodriguez",
        rating: 5,
        content:
            "As a developer, I bookmark hundreds of resources every month. Markify's tagging and collection system is a game-changer. I can find any saved link in seconds. Worth every penny.",
    },
    {
        name: "Emily Chen",
        rating: 5,
        content:
            "I've tried at least five bookmark managers before landing on Markify. The UI is gorgeous, the search is lightning-fast, and the AI-powered suggestions actually make sense. This is the one I'm sticking with.",
    },
    {
        name: "David Kowalski",
        rating: 4,
        content:
            "Really solid bookmark manager. The collections feature is incredibly useful for separating work and personal links. Only wish I could bulk-import from Pocket, but everything else is top-notch.",
    },
    {
        name: "Priya Sharma",
        rating: 5,
        content:
            "Markify's clean interface makes organizing bookmarks actually enjoyable. The dark mode looks stunning and the keyboard shortcuts save me so much time. Hands down the best tool in my productivity stack.",
    },
    {
        name: "Michael Thompson",
        rating: 5,
        content:
            "I manage content libraries for three different clients. Markify lets me keep everything separated with collections while still being able to search across all of them. Absolute lifesaver for content strategists.",
    },
    {
        name: "Aisha Patel",
        rating: 4,
        content:
            "Love the minimalist design and how fast everything loads. The browser extension captures page titles and descriptions automatically, which saves a ton of manual work. Great product overall.",
    },
    {
        name: "Lucas Andersson",
        rating: 5,
        content:
            "Switched from Raindrop.io to Markify and haven't looked back. The bookmark preview cards with screenshots make it so much easier to visually scan through saved pages. Brilliant design choice.",
    },
    {
        name: "Olivia Martinez",
        rating: 5,
        content:
            "The shared collections feature is perfect for our small team. We maintain a shared research library and everyone can contribute links. Collaboration has never been easier.",
    },
    {
        name: "Ryan O'Brien",
        rating: 4,
        content:
            "Markify replaced my chaotic browser bookmarks bar with something I can actually navigate. The category system is intuitive, and I love that I can access my bookmarks from any device.",
    },
    {
        name: "Nina Johansson",
        rating: 5,
        content:
            "As a UX researcher, I save hundreds of design references weekly. Markify's visual cards and tagging system make it trivially easy to build mood boards and reference libraries. Can't recommend it enough.",
    },
    {
        name: "Tom Nakamura",
        rating: 5,
        content:
            "The AI-powered categorization feature blew my mind. I imported 500+ bookmarks and Markify organized them into logical collections automatically. Saved me hours of manual sorting.",
    },
    {
        name: "Rebecca Foster",
        rating: 5,
        content:
            "Finally, a bookmark manager that doesn't look like it was designed in 2010. Markify is modern, fast, and actually makes me want to organize my links. The onboarding experience was seamless too.",
    },
    {
        name: "Alex Kim",
        rating: 4,
        content:
            "Great tool for anyone drowning in browser tabs. I went from 80+ open tabs to a clean browser with everything saved in Markify. The search function is incredibly accurate and fast.",
    },
    {
        name: "Maria Gonzalez",
        rating: 5,
        content:
            "I use Markify daily for my freelance work. Being able to share curated bookmark collections with clients has been a huge value-add to my service. The public share links are clean and professional.",
    },
    {
        name: "Chris Williams",
        rating: 5,
        content:
            "The keyboard-first navigation is something I didn't know I needed. Cmd+K to search, quick shortcuts to add bookmarks — it feels like it was built by developers, for developers. Excellent DX.",
    },
    {
        name: "Sophie Laurent",
        rating: 4,
        content:
            "Markify has become my second brain for web content. I save everything from recipes to research papers, and the tags make retrieval instant. Much better than my old method of 200 Chrome bookmark folders.",
    },
    {
        name: "Daniel Park",
        rating: 5,
        content:
            "The preview images on bookmark cards are genius. I can scan through my saved articles visually instead of reading through a list of URLs. Makes the whole experience feel premium.",
    },
    {
        name: "Hannah Weber",
        rating: 5,
        content:
            "Our marketing team adopted Markify last month and it's already improved how we share competitive research. The collections are well-organized and the UI is clean enough that even non-tech teammates use it happily.",
    },
    {
        name: "Kevin Murphy",
        rating: 4,
        content:
            "Simple, beautiful, and effective. Markify does exactly what it promises without unnecessary bloat. The free tier is generous enough for personal use, and the premium features are worth upgrading for.",
    },
    {
        name: "Zara Hussain",
        rating: 5,
        content:
            "I'm a student and Markify has been incredible for organizing my research sources. I tag everything by course and topic, and when exam season comes, all my study materials are right where I need them.",
    },
    {
        name: "Ben Taylor",
        rating: 5,
        content:
            "After years of losing important bookmarks in browser crashes, Markify gives me peace of mind. Cloud-synced, well-organized, and always accessible. It's one of those tools you wonder how you lived without.",
    },
    {
        name: "Laura Fischer",
        rating: 4,
        content:
            "The import feature made migration painless — brought in all my Chrome bookmarks in under a minute. The automatic favicon fetching is a nice touch that makes everything look polished.",
    },
    {
        name: "Raj Mehta",
        rating: 5,
        content:
            "Markify's dashboard is beautiful. The stats, the visual bookmark cards, the quick actions — everything is thoughtfully designed. You can tell the team actually cares about user experience.",
    },
    {
        name: "Anna Svensson",
        rating: 5,
        content:
            "I recommend Markify to every designer I know. The ability to save, tag, and visually browse inspiration links has replaced three other tools in my workflow. Clean, fast, and reliable.",
    },
    {
        name: "Marcus Lee",
        rating: 4,
        content:
            "Really impressed with how lightweight the Chrome extension is — no slowdowns, no memory issues. It captures bookmarks in one click and syncs instantly. Exactly what a browser extension should be.",
    },
    {
        name: "Fatima Al-Rashid",
        rating: 5,
        content:
            "The favorites feature is perfect for pinning my most-used resources. Combined with collections and tags, I have a three-layer organization system that keeps everything accessible. Markify just works.",
    },
    {
        name: "Jack Morrison",
        rating: 5,
        content:
            "Tried Markify on a friend's recommendation and signed up for premium within the first week. The voice input for adding bookmarks is surprisingly accurate and the Gemini AI integration is next-level.",
    },
    {
        name: "Yuki Tanaka",
        rating: 5,
        content:
            "As someone who curates reading lists for a newsletter, Markify is indispensable. I can organize links by topic, add my own notes, and share specific collections with subscribers. Incredible tool.",
    },
    {
        name: "Elena Petrova",
        rating: 4,
        content:
            "Clean interface, fast performance, and smart organization. Markify has replaced my messy spreadsheet of links with something actually enjoyable to use. The dark mode is gorgeous too.",
    },
];

async function seedReviews() {
    console.log("🌱 Starting review seeding...\n");

    let created = 0;
    let skipped = 0;

    for (const review of reviews) {
        const email = `${review.name.toLowerCase().replace(/[^a-z]/g, ".")}@reviewer.markify.fake`;

        try {
            // Check if this fake reviewer user already exists
            let user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                user = await prisma.user.create({
                    data: {
                        name: review.name,
                        email,
                        password: crypto.randomBytes(32).toString("hex"), // random unusable password
                        isVerified: true,
                    },
                });
                console.log(`  👤 Created user: ${review.name}`);
            }

            // Check if review already exists for this user
            const existing = await prisma.review.findUnique({
                where: { userId: user.id },
            });

            if (existing) {
                console.log(`  ⏭️  Skipped (already exists): ${review.name}`);
                skipped++;
                continue;
            }

            await prisma.review.create({
                data: {
                    rating: review.rating,
                    content: review.content,
                    status: "APPROVED",
                    userId: user.id,
                },
            });

            console.log(`  ⭐ Created review: ${review.name} (${review.rating}/5)`);
            created++;
        } catch (error) {
            console.error(`  ❌ Error for ${review.name}:`, error.message);
        }
    }

    console.log(`\n✅ Seeding complete: ${created} created, ${skipped} skipped.`);
}

seedReviews()
    .catch((e) => {
        console.error("Fatal error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
