export const FEATURES = [
  {
    slug: "lightning-search",
    title: "Lightning Search",
    description:
      "Find any bookmark instantly with Cmd+K, filters, and fast keyword search.",
    hero: {
      eyebrow: "Search Fast",
      heading: "Find anything in seconds",
      subheading:
        "Jump from a thought to the exact link you saved with global search.",
    },
    benefits: [
      {
        title: "Global shortcut",
        description: "Open search from anywhere with Cmd+K or Ctrl+K.",
      },
      {
        title: "Smart filters",
        description: "Narrow results by tags, collections, or domains.",
      },
      {
        title: "Instant previews",
        description: "Scan results quickly with clear titles and metadata.",
      },
    ],
    workflows: [
      "Press Cmd+K to open search at any time.",
      "Type a keyword, domain, or tag.",
      "Jump directly to the saved page.",
    ],
    faqs: [
      {
        question: "Can I search inside a collection?",
        answer:
          "Yes. Filter by collection first, then search to stay focused.",
      },
      {
        question: "Does search work on mobile?",
        answer:
          "Search is available across devices so you can find links anywhere.",
      },
    ],
    keywords: [
      "bookmark search",
      "global search",
      "tag filters",
      "markify search",
    ],
    iconKey: "search",
    layout: "md:col-span-2 md:row-span-1",
    gradient: "from-orange-500/20 to-red-500/20",
  },
  {
    slug: "smart-collections",
    title: "Smart Collections",
    description:
      "Organize bookmarks into flexible collections for every project.",
    hero: {
      eyebrow: "Stay Organized",
      heading: "Collections that match your workflow",
      subheading:
        "Group links by client, topic, or goal and keep everything tidy.",
    },
    benefits: [
      {
        title: "Project ready",
        description: "Create collections that mirror how your work is structured.",
      },
      {
        title: "Fast grouping",
        description: "Move, sort, and filter links with a few clicks.",
      },
      {
        title: "Shareable sets",
        description: "Send curated collections to teammates or clients.",
      },
    ],
    workflows: [
      "Create a collection for a new project.",
      "Save links directly into the right place.",
      "Share or export when you are ready.",
    ],
    faqs: [
      {
        question: "Can I rename or reorder collections?",
        answer: "Yes. Edit collection names and ordering anytime.",
      },
      {
        question: "Can I share a collection publicly?",
        answer:
          "Yes. You can create a public share link when you need one.",
      },
    ],
    keywords: [
      "bookmark collections",
      "organize bookmarks",
      "project folders",
      "share collections",
    ],
    iconKey: "collections",
    layout: "md:col-span-1 md:row-span-1",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    slug: "quick-favorites",
    title: "Quick Favorites",
    description: "Star your most important links for one click access.",
    hero: {
      eyebrow: "Stay Focused",
      heading: "Pin your go-to links",
      subheading:
        "Highlight the pages you need every day and reach them instantly.",
    },
    benefits: [
      {
        title: "One click access",
        description: "Favorite links stay at the top of your workspace.",
      },
      {
        title: "Less digging",
        description: "Skip long lists by pinning your essentials.",
      },
      {
        title: "Better focus",
        description: "Keep your active work separate from your archive.",
      },
    ],
    workflows: [
      "Star the links you use most often.",
      "Open favorites first when you start a task.",
      "Unstar links when they are no longer active.",
    ],
    faqs: [
      {
        question: "Is there a limit to favorites?",
        answer: "Favorites are designed for your top links, not a hard limit.",
      },
    ],
    keywords: [
      "bookmark favorites",
      "pin links",
      "quick access bookmarks",
      "priority links",
    ],
    iconKey: "favorites",
    layout: "md:col-span-1 md:row-span-1",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    slug: "import-export",
    title: "Import and Export",
    description:
      "Bring your bookmarks in from any browser and export whenever you want.",
    hero: {
      eyebrow: "Move Fast",
      heading: "Migrate without the pain",
      subheading:
        "Import from Chrome, Firefox, Safari, or Edge and keep your history.",
    },
    benefits: [
      {
        title: "Easy import",
        description: "Upload a browser export and you are ready in minutes.",
      },
      {
        title: "Flexible export",
        description: "Download your data in JSON, CSV, or HTML.",
      },
      {
        title: "No lock in",
        description: "Your data is portable whenever you need it.",
      },
    ],
    workflows: [
      "Export bookmarks from your browser.",
      "Import the file into Markify.",
      "Export again anytime you want a backup.",
    ],
    faqs: [
      {
        question: "Which browsers are supported?",
        answer:
          "Chrome, Firefox, Safari, Edge, and other browsers with HTML export.",
      },
    ],
    keywords: [
      "import bookmarks",
      "export bookmarks",
      "bookmark migration",
      "data portability",
    ],
    iconKey: "import-export",
    layout: "md:col-span-1 md:row-span-1",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    slug: "auto-tagging",
    title: "Auto Tagging",
    description: "AI powered tag suggestions keep your library organized.",
    hero: {
      eyebrow: "Stay Organized",
      heading: "Tags that keep up with you",
      subheading:
        "Let smart suggestions handle the busywork so your library stays clean.",
    },
    benefits: [
      {
        title: "Faster saving",
        description: "Auto tag suggestions reduce manual typing.",
      },
      {
        title: "Better discovery",
        description: "Consistent tags make search results stronger.",
      },
      {
        title: "Less clutter",
        description: "Keep tags aligned with your content as it grows.",
      },
    ],
    workflows: [
      "Save a link and review suggested tags.",
      "Accept, edit, or add your own tags.",
      "Search later using consistent labels.",
    ],
    faqs: [
      {
        question: "Can I edit suggested tags?",
        answer: "Yes. You can change or remove any tag at any time.",
      },
    ],
    keywords: [
      "auto tagging",
      "bookmark tags",
      "ai tag suggestions",
      "organize bookmarks",
    ],
    iconKey: "auto-tagging",
    layout: "md:col-span-1 md:row-span-1",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    slug: "privacy-first",
    title: "Privacy First",
    description: "Your data stays yours. No tracking, no selling, no noise.",
    hero: {
      eyebrow: "Privacy Matters",
      heading: "Built to protect your data",
      subheading:
        "Markify is designed to keep your bookmarks private and secure.",
    },
    benefits: [
      {
        title: "No tracking",
        description: "We do not sell your data or show you ads.",
      },
      {
        title: "Secure storage",
        description: "Bookmarks are protected in transit and at rest.",
      },
      {
        title: "You control sharing",
        description: "Share only what you want, when you want.",
      },
    ],
    workflows: [
      "Save private links with confidence.",
      "Share only the collections you choose.",
      "Keep personal and shared work separate.",
    ],
    faqs: [
      {
        question: "Do you sell user data?",
        answer: "No. Markify does not sell user data or run ads.",
      },
    ],
    keywords: [
      "private bookmarks",
      "secure bookmark manager",
      "privacy first",
      "data security",
    ],
    iconKey: "privacy",
    layout: "md:col-span-1 md:row-span-1",
    gradient: "from-slate-500/20 to-zinc-500/20",
  },
  {
    slug: "dark-mode",
    title: "Beautiful Dark Mode",
    description: "A clean, modern theme that is easy on your eyes.",
    hero: {
      eyebrow: "Work Comfortably",
      heading: "A theme that looks great all day",
      subheading:
        "Switch between light and dark modes to match your environment.",
    },
    benefits: [
      {
        title: "Eye friendly",
        description: "Reduce glare when working late or in low light.",
      },
      {
        title: "Consistent design",
        description: "The interface stays crisp in every theme.",
      },
      {
        title: "Easy toggle",
        description: "Switch themes instantly without losing your place.",
      },
    ],
    workflows: [
      "Toggle themes from the top navigation.",
      "Keep your workflow comfortable day and night.",
      "Match your OS theme if you prefer.",
    ],
    faqs: [
      {
        question: "Can I keep a fixed theme?",
        answer: "Yes. Choose light or dark and Markify will remember it.",
      },
    ],
    keywords: [
      "dark mode",
      "bookmark manager theme",
      "eye friendly ui",
      "theme toggle",
    ],
    iconKey: "dark-mode",
    layout: "md:col-span-1 md:row-span-1",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
];

export const getFeaturePath = (slug) => `/features/${slug}`;

export const getFeatureBySlug = (slug) =>
  FEATURES.find((feature) => feature.slug === slug);

export const getRelatedFeatures = (slug, count = 3) => {
  const candidates = FEATURES.filter((feature) => feature.slug !== slug);
  return candidates.slice(0, count);
};
