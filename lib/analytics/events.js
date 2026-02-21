export const ANALYTICS_EVENTS = {
  INTERNAL_SEARCH: "internal_search",
  OUTBOUND_CLICK: "outbound_click",
  COPY_ANSWER: "copy_answer",
  SHARE_X: "share_x",
  SHARE_LINKEDIN: "share_linkedin",
  CITE_COPY: "cite_copy",
};

export const trackEvent = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
    return;
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};
