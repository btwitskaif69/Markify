"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics/events";

const getAnchorFromTarget = (target) => {
  if (!(target instanceof Element)) return null;
  return target.closest("a[href]");
};

const isExternalLink = (href) => {
  if (!href || href.startsWith("#")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  try {
    const url = new URL(href, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
};

export default function TrackingProvider() {
  const pathname = usePathname();
  const lastTrackedSearch = useRef("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (pathname !== "/search" || !q) return;
    const key = `${pathname}:${q.trim().toLowerCase()}`;
    if (!q.trim() || lastTrackedSearch.current === key) return;
    lastTrackedSearch.current = key;
    trackEvent(ANALYTICS_EVENTS.INTERNAL_SEARCH, {
      search_term: q.trim(),
      page_path: pathname,
    });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event) => {
      const anchor = getAnchorFromTarget(event.target);
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!isExternalLink(href)) return;
      trackEvent(ANALYTICS_EVENTS.OUTBOUND_CLICK, {
        href,
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return null;
}
