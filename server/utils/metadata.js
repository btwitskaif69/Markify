const decodeHtmlEntities = (value = "") =>
  value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&nbsp;/gi, " ");

const normalizeText = (value = "") => decodeHtmlEntities(value).replace(/\s+/g, " ").trim();

const resolveUrl = (baseUrl, candidate) => {
  if (!candidate) return "";
  try {
    return new URL(candidate, baseUrl).toString();
  } catch {
    return candidate;
  }
};

const parseAttributes = (tag) => {
  const attrs = {};
  const attrRegex = /([^\s=]+)\s*=\s*(".*?"|'.*?'|[^\s>]+)/g;
  let match = null;

  while ((match = attrRegex.exec(tag)) !== null) {
    let value = match[2];
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    attrs[match[1].toLowerCase()] = value;
  }

  return attrs;
};

const collectMetaTags = (html) => {
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];
  const metaMap = {};

  for (const tag of metaTags) {
    const attrs = parseAttributes(tag);
    const content = attrs.content;
    if (!content) continue;

    const key = (attrs.property || attrs.name || attrs["http-equiv"] || "").toLowerCase();
    if (!key) continue;

    if (!metaMap[key]) metaMap[key] = [];
    metaMap[key].push(content);
  }

  return metaMap;
};

const findCanonicalUrl = (html) => {
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];
  for (const tag of linkTags) {
    const attrs = parseAttributes(tag);
    const rel = (attrs.rel || "").toLowerCase();
    if (rel.split(/\s+/).includes("canonical") && attrs.href) {
      return attrs.href;
    }
  }
  return "";
};

const findTitleTag = (html) => {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1] : "";
};

const pickMeta = (metaMap, keys) => {
  for (const key of keys) {
    const values = metaMap[key];
    if (values?.length) return values.find(Boolean) || "";
  }
  return "";
};

export const extractMetadataFromHtml = (html = "", baseUrl = "") => {
  if (!html) {
    return {
      title: "",
      description: "",
      image: null,
      url: baseUrl || "",
    };
  }

  const metaMap = collectMetaTags(html);
  const canonicalUrl = findCanonicalUrl(html);
  const titleTag = findTitleTag(html);

  const title =
    normalizeText(pickMeta(metaMap, ["og:title", "twitter:title"])) ||
    normalizeText(titleTag);
  const description = normalizeText(
    pickMeta(metaMap, ["og:description", "twitter:description", "description"])
  );
  const image = pickMeta(metaMap, [
    "og:image:secure_url",
    "og:image",
    "twitter:image",
    "twitter:image:src",
  ]);

  const resolvedUrl = resolveUrl(baseUrl, canonicalUrl || pickMeta(metaMap, ["og:url"]) || baseUrl);
  const resolvedImage = resolveUrl(resolvedUrl || baseUrl, image);

  return {
    title: title || "",
    description: description || "",
    image: resolvedImage || null,
    url: resolvedUrl || baseUrl || "",
  };
};
