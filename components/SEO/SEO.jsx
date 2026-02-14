"use client";

import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import {
  SITE_CONFIG,
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildWebPageSchema,
  getCanonicalUrl,
  getFullTitle,
  toAbsoluteUrl,
} from "@/lib/seo";

const SEO = ({
  title,
  description,
  canonical,
  path,
  type = "website",
  name = SITE_CONFIG.name,
  image = SITE_CONFIG.defaultImage,
  imageAlt,
  structuredData,
  noindex = false,
  robots,
  keywords,
  twitterHandle = SITE_CONFIG.twitterHandle,
  publishedTime,
  modifiedTime,
  author,
  themeColor = SITE_CONFIG.themeColor,
  includeSiteSchema = true,
  includeWebPageSchema = true,
  webPageType = "WebPage",
}) => {
  const pathname = usePathname();
  const canonicalUrl =
    canonical || getCanonicalUrl(path || pathname || "/");
  const metaDescription = description || SITE_CONFIG.defaultDescription;
  const fullTitle = getFullTitle(title, name);
  const resolvedImage = toAbsoluteUrl(image);
  const resolvedImageAlt = imageAlt || title || SITE_CONFIG.name;
  const robotsValue = robots || (noindex ? "noindex, nofollow" : "index, follow");
  const shouldIndex = !robotsValue.toLowerCase().includes("noindex");
  const isPrerender = typeof window !== "undefined" && window.__PRERENDER_STATUS;
  const resolvedStructuredData = [
    includeSiteSchema ? buildOrganizationSchema() : null,
    includeSiteSchema ? buildWebsiteSchema() : null,
    includeWebPageSchema && shouldIndex
      ? buildWebPageSchema({
        title: title || SITE_CONFIG.defaultTitle,
        description: metaDescription,
        url: canonicalUrl,
        type: webPageType,
      })
      : null,
    ...(structuredData
      ? Array.isArray(structuredData)
        ? structuredData
        : [structuredData]
      : []),
  ].filter(Boolean);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isPrerender) return;
    const notify = () => {
      document.dispatchEvent(new Event("markify:prerender-ready"));
    };
    const raf = requestAnimationFrame(notify);
    return () => cancelAnimationFrame(raf);
  }, [isPrerender, canonicalUrl, fullTitle, metaDescription, robotsValue]);

  return (
    <Helmet defer={!isPrerender}>
      {/* Standard metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robotsValue} />
      <meta name="googlebot" content={robotsValue} />
      {author ? <meta name="author" content={author} /> : null}
      {keywords?.length ? <meta name="keywords" content={keywords.join(", ")} /> : null}
      <meta name="theme-color" content={themeColor} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={resolvedImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={resolvedImageAlt} />
      {twitterHandle ? <meta name="twitter:site" content={twitterHandle} /> : null}
      {twitterHandle ? <meta name="twitter:creator" content={twitterHandle} /> : null}

      {/* Article metadata */}
      {type === "article" && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === "article" && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
      {type === "article" && author ? (
        <meta property="article:author" content={author} />
      ) : null}

      {/* Structured Data */}
      {resolvedStructuredData.length ? (
        <script type="application/ld+json">
          {JSON.stringify(resolvedStructuredData)}
        </script>
      ) : null}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  canonical: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  image: PropTypes.string,
  imageAlt: PropTypes.string,
  structuredData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  noindex: PropTypes.bool,
  robots: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  twitterHandle: PropTypes.string,
  publishedTime: PropTypes.string,
  modifiedTime: PropTypes.string,
  author: PropTypes.string,
  themeColor: PropTypes.string,
  includeSiteSchema: PropTypes.bool,
  includeWebPageSchema: PropTypes.bool,
  webPageType: PropTypes.string,
};

export default SEO;
