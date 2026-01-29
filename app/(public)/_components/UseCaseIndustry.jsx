import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPseoDetailPath, getPseoIndustryPath } from "@/lib/pseo";

const UseCaseIndustry = ({
  industry,
  intents = [],
  relatedIndustries = [],
}) => {
  if (!industry) return null;

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {industry.name} workflows
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Use cases for {industry.name} teams
            </h1>
            <p className="text-muted-foreground text-lg">
              {industry.description} Explore intent-based workflows built for{" "}
              {industry.name.toLowerCase()} teams that need fast access to shared
              knowledge.
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
                    <Link href={getPseoDetailPath(intent.slug, industry.slug)}>
                      View {intent.title.toLowerCase()}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {relatedIndustries.length ? (
          <section className="container mx-auto px-4 pb-16">
            <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                    Explore other industries
                  </h2>
                  <p className="text-muted-foreground">
                    See how different teams structure their bookmarking
                    workflows.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {relatedIndustries.map((related) => (
                    <Button key={related.slug} asChild variant="outline">
                      <Link href={getPseoIndustryPath(related.slug)}>
                        {related.name}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-3">
              Ready to organize {industry.name.toLowerCase()} resources?
            </h2>
            <p className="text-muted-foreground mb-6">
              Start free today or explore Markify pricing and features.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/signup">Start free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/features">Explore features</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default UseCaseIndustry;
