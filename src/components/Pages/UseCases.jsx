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
import {
  getPseoHubPath,
  getPseoIntentIndex,
  getPseoIntentPath,
} from "@/lib/pseo";
import { buildBreadcrumbSchema, buildItemListSchema, getCanonicalUrl } from "@/lib/seo";

const UseCases = () => {
  const intents = getPseoIntentIndex();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Use cases", path: getPseoHubPath() },
  ]);
  const itemListSchema = buildItemListSchema(
    intents.map((intent) => ({
      name: intent.title,
      path: getPseoIntentPath(intent.slug),
    })),
    { name: "Markify use cases" }
  );
  const structuredData = [breadcrumbs, itemListSchema].filter(Boolean);

  return (
    <>
      <SEO
        title="Use Cases"
        description="Explore programmatic SEO use cases built on structured data. Find the right workflow for your team and industry."
        canonical={getCanonicalUrl(getPseoHubPath())}
        structuredData={structuredData}
        keywords={[
          "use cases",
          "programmatic seo",
          "industry workflows",
          "bookmark manager",
        ]}
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Use cases
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Programmatic SEO workflows, organized by intent
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose a workflow to see how Markify helps teams organize research,
              share context, and move faster across industries.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {intents.map((intent) => (
              <Card
                key={intent.slug}
                className="border-border/60 bg-card/60 hover:bg-card transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{intent.title}</CardTitle>
                  <CardDescription>{intent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="gap-2">
                    <Link to={getPseoIntentPath(intent.slug)}>
                      Explore {intent.title.toLowerCase()}
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
              Want a tailored workflow?
            </h2>
            <p className="text-muted-foreground mb-6">
              Combine intents with industries to build targeted pages without
              duplicating content.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link to="/signup">Start free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/features">Explore features</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/contact">Talk to sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default UseCases;
