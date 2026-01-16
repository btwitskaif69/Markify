import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO/SEO";
import { API_BASE_URL } from "@/lib/apiConfig";
import { secureFetch } from "@/lib/secureApi";
import { FEATURES, getFeaturePath } from "@/data/features";
import { SOLUTIONS, getSolutionPath } from "@/data/solutions";
import { getCanonicalUrl } from "@/lib/seo";

const STATIC_PAGES = [
  {
    title: "Home",
    description: "Smart bookmark manager for collections, search, and sharing.",
    path: "/",
    type: "Page",
    keywords: ["bookmark manager", "markify", "save bookmarks"],
  },
  {
    title: "Features",
    description: "Explore the core features that power Markify.",
    path: "/features",
    type: "Page",
    keywords: ["features", "bookmark tools", "productivity"],
  },
  {
    title: "Solutions",
    description: "Use cases for researchers, designers, developers, students, and teams.",
    path: "/solutions",
    type: "Page",
    keywords: ["solutions", "use cases", "teams"],
  },
  {
    title: "Use Cases",
    description: "Programmatic SEO workflows organized by intent and industry.",
    path: "/use-cases",
    type: "Page",
    keywords: ["use cases", "programmatic seo", "industry workflows"],
  },
  {
    title: "Pricing",
    description: "Simple, transparent pricing for Free, Pro, and Team plans.",
    path: "/pricing",
    type: "Page",
    keywords: ["pricing", "plans", "subscription"],
  },
  {
    title: "Blog",
    description: "Updates, tips, and insights from the Markify team.",
    path: "/blog",
    type: "Page",
    keywords: ["blog", "updates", "guides"],
  },
  {
    title: "Contact",
    description: "Get in touch with the Markify team.",
    path: "/contact",
    type: "Page",
    keywords: ["contact", "support", "help"],
  },
  {
    title: "What is Markify?",
    description: "Learn how Markify compares to browser bookmarks.",
    path: "/what-is-markify",
    type: "Page",
    keywords: ["markify", "bookmark manager", "comparison"],
  },
  {
    title: "Privacy Policy",
    description: "How Markify collects and protects your data.",
    path: "/privacy",
    type: "Policy",
    keywords: ["privacy", "data", "policy"],
  },
  {
    title: "Terms of Service",
    description: "Terms and conditions for using Markify.",
    path: "/terms",
    type: "Policy",
    keywords: ["terms", "service", "policy"],
  },
  {
    title: "Cookie Policy",
    description: "How Markify uses cookies.",
    path: "/cookies",
    type: "Policy",
    keywords: ["cookies", "policy", "settings"],
  },
  {
    title: "Refund Policy",
    description: "Refund and cancellation information.",
    path: "/refund-policy",
    type: "Policy",
    keywords: ["refund", "billing", "support"],
  },
];

const normalize = (value) => (value || "").toLowerCase().trim();
const tokenize = (value) => normalize(value).split(/\s+/).filter(Boolean);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [input, setInput] = useState(query);
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);

  useEffect(() => {
    setInput(query);
  }, [query]);

  useEffect(() => {
    let isMounted = true;
    const fetchBlogPosts = async () => {
      setBlogLoading(true);
      try {
        const response = await secureFetch(`${API_BASE_URL}/blog`);
        if (!response.ok) return;
        const data = await response.json();
        if (!Array.isArray(data) || !isMounted) return;
        setBlogPosts(data);
      } catch (error) {
        console.error("Search blog fetch error:", error);
      } finally {
        if (isMounted) setBlogLoading(false);
      }
    };

    fetchBlogPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const searchIndex = useMemo(() => {
    const featureItems = FEATURES.map((feature) => ({
      title: feature.title,
      description: feature.description,
      path: getFeaturePath(feature.slug),
      type: "Feature",
      keywords: feature.keywords || [],
    }));
    const solutionItems = SOLUTIONS.map((solution) => ({
      title: solution.title,
      description: solution.description,
      path: getSolutionPath(solution.slug),
      type: "Solution",
      keywords: solution.keywords || [],
    }));
    const blogItems = blogPosts
      .filter((post) => post?.slug)
      .map((post) => ({
        title: post.title,
        description: post.excerpt || "Read the latest on the Markify blog.",
        path: `/blog/${post.slug}`,
        type: "Blog post",
        keywords: post.tags || [],
      }));
    return [...STATIC_PAGES, ...featureItems, ...solutionItems, ...blogItems];
  }, [blogPosts]);

  const results = useMemo(() => {
    const tokens = tokenize(query);
    if (!tokens.length) return [];
    return searchIndex.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        ...(item.keywords || []),
      ]
        .join(" ")
        .toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [query, searchIndex]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      setSearchParams({ q: trimmed });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <SEO
        title="Search"
        description="Search Markify pages, features, and solutions."
        canonical={getCanonicalUrl("/search")}
        noindex
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen pt-24 pb-20">
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Search Markify
            </h1>
            <p className="text-muted-foreground">
              Find features, solutions, and helpful resources across the site.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex gap-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Search for features, solutions, pricing..."
              className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-base"
              aria-label="Search Markify"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Search
            </button>
          </form>

          <div className="max-w-4xl mx-auto mt-10">
            {query ? (
              <>
                <p className="text-sm text-muted-foreground mb-6">
                  {results.length} result{results.length === 1 ? "" : "s"} for{" "}
                  <span className="text-foreground font-medium">"{query}"</span>
                </p>
                {results.length === 0 ? (
                  <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
                    <p className="text-muted-foreground">
                      No results yet. Try another term or browse popular pages
                      below.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {results.map((result) => (
                      <Link
                        key={`${result.type}-${result.path}`}
                        to={result.path}
                        className="rounded-2xl border border-border bg-card/60 p-6 transition-colors hover:bg-card"
                      >
                        <div className="flex flex-wrap items-center gap-3 mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                          <span>{result.type}</span>
                        </div>
                        <h2 className="text-lg font-semibold mb-2">
                          {result.title}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {result.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
                {blogLoading ? (
                  <p className="text-xs text-muted-foreground mt-6">
                    Loading blog results...
                  </p>
                ) : null}
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
                <p className="text-muted-foreground">
                  Enter a search term to explore Markify. Popular pages are
                  listed below.
                </p>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-lg font-semibold mb-4">Popular pages</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {STATIC_PAGES.slice(0, 6).map((page) => (
                <Link
                  key={page.path}
                  to={page.path}
                  className="rounded-xl border border-border bg-card/60 p-4 text-sm text-muted-foreground hover:bg-card"
                >
                  <span className="block font-medium text-foreground mb-1">
                    {page.title}
                  </span>
                  {page.description}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default SearchPage;
