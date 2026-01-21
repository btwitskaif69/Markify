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
import { SOLUTIONS, getSolutionPath } from "@/data/solutions";
import { buildBreadcrumbSchema, buildItemListSchema, getCanonicalUrl } from "@/lib/seo";

const solutionsItemListSchema = buildItemListSchema(
  SOLUTIONS.map((solution) => ({
    name: solution.title,
    path: getSolutionPath(solution.slug),
  })),
  { name: "Markify Solutions" }
);

const Solutions = () => {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/solutions" },
  ]);
  const structuredData = [breadcrumbs, solutionsItemListSchema].filter(Boolean);

  return (
    <>
      <SEO
        title="Bookmark Manager Solutions for Every Team"
        description="Explore Markify solutions for researchers, designers, developers, students, and teams who need organized, searchable bookmark workflows."
        canonical={getCanonicalUrl("/solutions")}
        structuredData={structuredData}
      />
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              Solutions
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Built for the way you work
            </h1>
            <p className="text-muted-foreground text-lg">
              Pick a use case to see how Markify helps you save, organize, and share
              the links that matter most.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((solution) => (
              <Card
                key={solution.slug}
                className="border-border/60 bg-card/60 hover:bg-card transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{solution.title}</CardTitle>
                  <CardDescription>{solution.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="gap-2">
                    <Link to={getSolutionPath(solution.slug)}>
                      Explore solution <ArrowRight className="h-4 w-4" />
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
              Ready to organize everything in one place?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start free today or learn more about Markify features and pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link to="/signup">Get started free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/pricing">View pricing</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/features">Explore features</Link>
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

export default Solutions;
