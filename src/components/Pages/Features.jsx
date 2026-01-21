import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { FEATURES, getFeaturePath } from "@/data/features";
import { FEATURE_ICONS } from "@/data/featureIcons";
import { buildBreadcrumbSchema, buildItemListSchema, getCanonicalUrl } from "@/lib/seo";

const featuresItemListSchema = buildItemListSchema(
  FEATURES.map((feature) => ({
    name: feature.title,
    path: getFeaturePath(feature.slug),
  })),
  { name: "Markify Features" }
);

const FeaturesPage = () => {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
  ]);
  const structuredData = [breadcrumbs, featuresItemListSchema].filter(Boolean);

  return (
    <>
      <SEO
        title="Bookmark Manager Features for Fast Search"
        description="Explore Markify features like lightning search, smart collections, auto-tagging, and privacy-first bookmarking built for faster organization."
        canonical={getCanonicalUrl("/features")}
        keywords={[
          "bookmark manager features",
          "bookmark tools",
          "organize bookmarks",
          "markify features",
        ]}
        structuredData={structuredData}
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Features
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Everything you need to manage bookmarks
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the building blocks that keep Markify fast, organized, and
              effortless to use.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = FEATURE_ICONS[feature.iconKey];
              return (
                <Card
                  key={feature.slug}
                  className="border-border/60 bg-card/60 hover:bg-card transition-colors"
                >
                  <CardHeader>
                    {Icon ? (
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    ) : null}
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="gap-2">
                      <Link to={getFeaturePath(feature.slug)}>
                        View feature <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Ready to see Markify in action?
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore use cases, pricing, and product updates to find the right
              fit for your workflow.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link to="/solutions">Browse solutions</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/pricing">View pricing</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/blog">Read the blog</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default FeaturesPage;
