export const INTERNAL_LINK_HUBS = {
  problem: "/problems",
  comparison: "/compare",
  question: "/questions",
  programmatic: "/use-cases",
  blog: "/blog",
};

export const buildLinkingPlan = ({
  hub,
  currentPath,
  relatedSpokes = [],
  maxRelated = 4,
} = {}) => {
  const safeHub = hub || INTERNAL_LINK_HUBS.blog;
  return {
    hub: safeHub,
    current: currentPath,
    related: relatedSpokes.filter(Boolean).slice(0, maxRelated),
    breadcrumb: ["/", safeHub, currentPath].filter(Boolean),
  };
};
