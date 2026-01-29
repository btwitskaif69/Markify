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
import { getPseoIndustryPath } from "@/lib/pseo";

const UseCaseIndustries = ({ industries = [] }) => (
  <>
    <Navbar />

    <main className="bg-background text-foreground min-h-screen">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            Industries
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Industry-specific bookmark workflows
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore how Markify supports teams across different industries with
            tailored collections, search, and sharing.
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
                  <Link href={getPseoIndustryPath(industry.slug)}>
                    View {industry.name} workflows
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
            Build your own use case hub
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect industries with intents to create targeted programmatic SEO
            pages and guide teams to the right workflows.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/use-cases">Browse intents</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/features">Explore features</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">Talk to sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </>
);

export default UseCaseIndustries;
