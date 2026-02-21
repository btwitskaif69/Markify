import { SITE_CONFIG, getCanonicalUrl } from "@/lib/seo";
import prisma from "@/server/db/prismaClient";

export const runtime = "nodejs";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const stripHtml = (value = "") => String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const toRssItem = (post) => {
  const url = getCanonicalUrl(`/blog/${post.slug}`);
  const description = stripHtml(post.excerpt || post.content || "");
  return `<item>
  <title>${escapeXml(post.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
  <description>${escapeXml(description)}</description>
</item>`;
};

const getFeedPosts = async () => {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
  } catch (error) {
    console.warn("RSS fetch failed:", error?.message || error);
    return [];
  }
};

export async function GET() {
  const posts = await getFeedPosts();
  const latestDate = posts[0]?.updatedAt
    ? new Date(posts[0].updatedAt).toUTCString()
    : new Date().toUTCString();

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(SITE_CONFIG.name)} Blog</title>
  <link>${SITE_CONFIG.url}/blog</link>
  <description>${escapeXml(SITE_CONFIG.defaultDescription)}</description>
  <language>en-us</language>
  <lastBuildDate>${latestDate}</lastBuildDate>
  ${posts.map(toRssItem).join("\n  ")}
</channel>
</rss>`;

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
