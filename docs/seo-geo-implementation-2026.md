# SEO + GEO Implementation Plan (2026)

## Phase 1: Technical SEO Foundation (Week 1)
- Ship dynamic crawl files: `robots.txt`, `sitemap.xml`, `rss.xml`.
- Standardize metadata via `buildMetadata()` for canonical, robots, OpenGraph, Twitter, and hreflang.
- Clean URL stability:
  - Canonicalize paginated blog URLs (`/blog`, `/blog/page/[page]`).
  - Use permanent redirects for legacy slugs.
  - Keep auth/admin/dashboard routes noindex.
- Add trust pages for E-E-A-T:
  - `/authors`
  - `/authors/[slug]`
  - `/editorial-policy`

## Phase 2: AI Answer Optimization + Content System (Week 2-3)
- Add reusable AI-friendly blocks:
  - `QuestionFirstAnswer`
  - `TldrSummary`
  - `KeyStatsWithSources`
  - `ProsConsTable`
  - `AlternativesSection`
- Add distribution/trust actions:
  - `CopyAnswerButton`
  - `ShareSnippetButtons` (X/LinkedIn)
  - `CiteThisPage`
  - `TrustSignals` (last updated, reviewed by, citations)
- Enforce content model via `lib/content/frontmatter.js`.
- Wire content model into blog metadata + schema generation.

## Phase 3: Scaling + Weekly Execution Loop (Week 4+)
- Enforce programmatic QA gates in `scripts/pseo-audit.mjs`:
  - Min word count
  - FAQ/checklist depth
  - Related-link coverage
  - Duplicate title/description/H1 checks
- Run weekly SEO/GEO audit and content refresh loop.
- Track AI citation visibility across platforms.

## Proposed Folder Structure
```txt
app/
  (public)/
    blog/
      page.jsx
      page/[page]/page.jsx
      [slug]/page.jsx
    authors/
      page.jsx
      [slug]/page.jsx
    editorial-policy/page.jsx
  robots.txt/route.js
  sitemap.xml/route.js
  sitemap/[page]/route.js
  rss.xml/route.js

components/
  analytics/
    GoogleAnalytics.jsx
    TrackingProvider.jsx
  content/
    AiAnswerBlocks.jsx
    ContentActions.jsx
    TrustSignals.jsx
    mdx-components.js

lib/
  analytics/events.js
  content/
    frontmatter.js
    blog-meta.js
    authors.js
  seo/
    metadata.js
    sitemap.js
```

## URL Conventions
- Problem-first pages:
  - `/problems/[problem-slug]`
- Comparison/alternatives pages:
  - `/compare/[topic]-vs-[alternative]`
  - Existing blog comparison pages remain valid under `/blog/[slug]`.
- Long-tail Q&A pages:
  - `/questions/[question-slug]`
  - Existing Q&A content can live under `/blog/[slug]` with question intent.
- Programmatic pages:
  - `/use-cases/[intent]/[industry]`

## Internal Linking Rules
- Hub -> spoke:
  - Hubs: `/blog`, `/use-cases`, `/solutions`, `/features`.
  - Every spoke links back to its hub.
- Spoke -> related spokes:
  - Link to 2-4 related pages by intent/industry/topic similarity.
- Breadcrumbs on all indexable templates:
  - Home -> Hub -> Spoke.

## Frontmatter / CMS Content Model
```yaml
title: "How to build a personal knowledge base with bookmarks"
description: "Step-by-step guide..."
primaryKeyword: "personal knowledge base bookmarks"
secondaryKeywords:
  - "pkb workflow"
  - "bookmark organization"
intent: "question" # problem | comparison | question
cluster: "bookmark-management"
hubSlug: "/blog"
lastUpdated: "2026-02-21"
reviewedBy: "Markify Editorial Team"
citations:
  - title: "Source title"
    url: "https://example.com/report"
    publisher: "Source publisher"
question: "How do you build a personal knowledge base with bookmarks?"
shortAnswer: "40-80 words direct answer..."
tldr:
  - "bullet 1"
  - "bullet 2"
keyStats:
  - label: "Metric"
    value: "42%"
    sourceUrl: "https://example.com/study"
alternatives:
  - name: "Alternative page"
    href: "/compare/x-vs-y"
    summary: "why this alternative exists"
```

## Programmatic SEO Safety Rules
- Minimum word count: >= 450 words per page.
- Minimum FAQ depth: >= 3 Q&A pairs.
- Minimum checklist depth: >= 3 actionable items.
- Unique value requirements:
  - Distinct summary + overview + benefits sections.
  - Related intent and related industry links present.
- QA checks:
  - Duplicate title/description/H1 detection.
  - Missing-page and thin-page fail-fast in strict mode.

## Tracking Setup
- GA4:
  - Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Vercel env.
- Search Console:
  - Set `NEXT_PUBLIC_GSC_VERIFICATION` (or `GSC_VERIFICATION_TOKEN`).
  - Added in global metadata verification.
- Tracked events:
  - `internal_search`
  - `outbound_click`
  - `copy_answer`
  - `share_x`
  - `share_linkedin`
  - `cite_copy`

## AI Visibility Tracker Plan
- Query buckets:
  - Problem queries
  - Comparison queries
  - Question queries
  - Brand + non-brand variations
- Platforms to check weekly:
  - Google AI Overviews
  - Bing/Copilot
  - Perplexity
  - ChatGPT browsing
- Spreadsheet schema:
  - `query`
  - `date`
  - `platform`
  - `cited` (yes/no)
  - `position_or_rank` (if visible)
  - `snippet_used` (text excerpt)
  - `cited_url`
  - `intent`
  - `notes`

## Weekly SEO Agent Runbook Prompt
```txt
Audit this Next.js project for SEO + GEO this week.

Scope:
1) Technical: crawlability, robots, sitemap freshness, canonical/hreflang consistency, indexability mistakes.
2) Performance: CWV-impacting templates, image/font/script regressions.
3) Content: declining pages, stale lastUpdated values, thin/duplicate pages, missing citations.
4) Internal links: missing hub->spoke and related-spoke opportunities.
5) GEO readiness: answer-first formatting, TL;DR, alternatives, citation readiness.
6) Distribution: propose 5 posts (Reddit/Quora/X/LinkedIn/forums) mapped to top pages.
7) Tracking: review GA4 + GSC + AI visibility log for gains/losses.

Output:
- Priority list (P0/P1/P2)
- Exact files/routes to change
- Suggested copy updates
- One-week implementation checklist
```

## Developer Handoff Checklist
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` configured.
- [ ] `NEXT_PUBLIC_GSC_VERIFICATION` configured.
- [ ] Dynamic `robots.txt`, `sitemap.xml`, and `rss.xml` reachable.
- [ ] New pages indexed: `/authors`, `/authors/[slug]`, `/editorial-policy`.
- [ ] Blog pagination routes live and internally linked.
- [ ] AI content blocks available for MDX/CMS authors.
- [ ] Citation + share + copy-answer actions tracked in analytics.
- [ ] `npm run pseo:audit` added to weekly ops checklist.
