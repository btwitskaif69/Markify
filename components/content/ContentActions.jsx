"use client";

import { useMemo, useState } from "react";
import { Copy, ExternalLink, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";

const siteName = "Markify";

const copyText = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
};

const toDateString = (value) => {
  if (!value) return new Date().toISOString().slice(0, 10);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const buildCitationFormats = ({ title, url, lastUpdated, author = "Markify Editorial Team" }) => {
  const iso = toDateString(lastUpdated);
  const longDate = new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    apa: `${author}. (${new Date(iso).getFullYear()}). ${title}. ${siteName}. ${url}`,
    mla: `${author}. "${title}." ${siteName}, ${longDate}, ${url}.`,
    chicago: `${author}. "${title}." ${siteName}. Last modified ${longDate}. ${url}.`,
  };
};

export const CopyAnswerButton = ({ answer, pagePath = "" }) => {
  const [copied, setCopied] = useState(false);
  if (!answer) return null;

  const onCopy = async () => {
    const ok = await copyText(answer);
    if (!ok) return;
    setCopied(true);
    trackEvent(ANALYTICS_EVENTS.COPY_ANSWER, { page_path: pagePath });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button type="button" variant="outline" size="sm" onClick={onCopy}>
      <Copy className="mr-2 h-4 w-4" />
      {copied ? "Copied" : "Copy answer"}
    </Button>
  );
};

export const ShareSnippetButtons = ({ title, url, answer, pagePath = "" }) => {
  if (!title || !url) return null;
  const snippet = answer || title;
  const xText = `${snippet} ${url}`.slice(0, 270);
  const linkedinText = `${snippet}\n\n${url}`;

  const openShare = (platform) => {
    const target =
      platform === "x"
        ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(xText)}`
        : `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedinText)}`;
    trackEvent(
      platform === "x" ? ANALYTICS_EVENTS.SHARE_X : ANALYTICS_EVENTS.SHARE_LINKEDIN,
      { page_path: pagePath, url }
    );
    window.open(target, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" size="sm" onClick={() => openShare("x")}>
        <Share2 className="mr-2 h-4 w-4" />
        Share to X
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => openShare("linkedin")}>
        <ExternalLink className="mr-2 h-4 w-4" />
        Share to LinkedIn
      </Button>
    </div>
  );
};

export const CiteThisPage = ({ title, url, lastUpdated, author, pagePath = "" }) => {
  const formats = useMemo(
    () => buildCitationFormats({ title, url, lastUpdated, author }),
    [title, url, lastUpdated, author]
  );
  if (!title || !url) return null;

  const onCopy = async (label, value) => {
    const ok = await copyText(value);
    if (!ok) return;
    trackEvent(ANALYTICS_EVENTS.CITE_COPY, {
      page_path: pagePath,
      format: label,
    });
  };

  return (
    <section className="rounded-xl border border-border/70 bg-card/80 p-4">
      <h3 className="mb-3 text-sm font-semibold">Cite this page</h3>
      <div className="space-y-3 text-sm text-muted-foreground">
        {Object.entries(formats).map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border/60 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
              {label}
            </p>
            <p className="mb-3">{value}</p>
            <Button type="button" variant="outline" size="sm" onClick={() => onCopy(label, value)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy {label.toUpperCase()}
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};
