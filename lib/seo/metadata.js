import { SITE_CONFIG, getCanonicalUrl, getFullTitle, toAbsoluteUrl } from "@/lib/seo";

const buildRobots = ({ noindex, nofollow } = {}) => {
  if (!noindex && !nofollow) return undefined;
  return {
    index: !noindex,
    follow: !nofollow,
    googleBot: {
      index: !noindex,
      follow: !nofollow,
    },
  };
};

export const buildMetadata = ({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
  nofollow = false,
  keywords,
  publishedTime,
  modifiedTime,
  author,
} = {}) => {
  const canonical = getCanonicalUrl(path);
  const metaTitle = getFullTitle(title, SITE_CONFIG.name);
  const metaDescription = description || SITE_CONFIG.defaultDescription;
  const imageUrl = toAbsoluteUrl(image || SITE_CONFIG.defaultImage);
  const robots = buildRobots({ noindex, nofollow });
  const openGraph = {
    type,
    title: metaTitle,
    description: metaDescription,
    url: canonical,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title || SITE_CONFIG.name,
      },
    ],
  };

  if (type === "article") {
    if (publishedTime) openGraph.publishedTime = publishedTime;
    if (modifiedTime) openGraph.modifiedTime = modifiedTime;
    if (author) openGraph.authors = [author];
  }

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical,
    },
    keywords: keywords?.length ? keywords : undefined,
    robots,
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [imageUrl],
      site: SITE_CONFIG.twitterHandle || undefined,
      creator: SITE_CONFIG.twitterHandle || undefined,
    },
    other: {
      "theme-color": SITE_CONFIG.themeColor,
      ...(publishedTime ? { "article:published_time": publishedTime } : {}),
      ...(modifiedTime ? { "article:modified_time": modifiedTime } : {}),
    },
    ...(author ? { authors: [{ name: author }] } : {}),
  };
};
