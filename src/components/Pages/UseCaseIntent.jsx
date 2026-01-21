import { Link, useParams } from "react-router-dom";
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
import NotFoundPage from "@/components/NotFoundPage";
import {
  getPseoHubPath,
  getPseoIntentBySlug,
  getPseoIntentIndex,
  getPseoIntentPath,
  getPseoDetailPath,
  getPseoIndustriesForIntent,
} from "@/lib/pseo";
import { buildBreadcrumbSchema, buildItemListSchema, getCanonicalUrl } from "@/lib/seo";

const UseCaseIntent = () => {
  const { intent: intentSlug } = useParams();
  const intent = getPseoIntentBySlug(intentSlug);

  if (!intent) {
    return <NotFoundPage />;
  }

  const industries = getPseoIndustriesForIntent(intent.slug);
  const relatedIntents = getPseoIntentIndex()
    .filter((item) => item.slug !== intent.slug)
    .slice(0, 4);
  const canonical = getCanonicalUrl(getPseoIntentPath(intent.slug));
  const seoTitle = `${intent.title} bookmarks by industry`;
  const seoDescription = `${intent.description} Explore industry-specific bookmark workflows that keep ${intent.title.toLowerCase()} resources organized and searchable.`;
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: getPseoHubPath() },
    { name: intent.title, path: getPseoIntentPath(intent.slug) },
  ]);
  const itemListSchema = buildItemListSchema(
    industries.map((industry) => ({
      name: industry.name,
      path: getPseoDetailPath(intent.slug, industry.slug),
    })),
    { name: `${intent.title} by industry` }
  );
  const structuredData = [breadcrumbs, itemListSchema].filter(Boolean);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonical}
        structuredData={structuredData}
        keywords={[intent.primaryKeyword, ...intent.keywords]}
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Use case
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {intent.title} by industry
            </h1>
            <p className="text-muted-foreground text-lg">
              {intent.description} Explore tailored workflows built for every
              industry without keyword cannibalization.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.map((industry) => (
              <Card
                key={industry.slug}
                className="border-border/60 bg-card/60 hover:bg-card transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{industry.name}</CardTitle>
                  <CardDescription>{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="gap-2">
                    <Link to={getPseoDetailPath(intent.slug, industry.slug)}>
                      View {industry.name} page
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Explore more workflows
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse related intents to build a complete pSEO hub-and-spoke
              structure.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedIntents.map((related) => (
                <Button key={related.slug} asChild variant="outline" size="sm">
                  <Link to={getPseoIntentPath(related.slug)}>
                    {related.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default UseCaseIntent;
