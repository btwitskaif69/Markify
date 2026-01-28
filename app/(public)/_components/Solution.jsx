"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
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
import NotFoundPage from "@/components/NotFoundPage";
import {
  getRelatedSolutions,
  getSolutionBySlug,
  getSolutionPath,
} from "@/data/solutions";

const Solution = () => {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    return <NotFoundPage />;
  }

  const relatedSolutions = getRelatedSolutions(solution.slug);

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {solution.hero.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {solution.hero.heading}
            </h1>
            <p className="text-muted-foreground text-lg">
              {solution.hero.subheading}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild>
                <Link href="/signup">Start free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            {solution.benefits.map((benefit) => (
              <Card key={benefit.title} className="bg-card/70 border-border/60">
                <CardHeader>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4">
                A workflow that stays organized
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                {solution.workflows.map((step) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="border-border/60 bg-card/70">
              <CardHeader>
                <CardTitle className="text-lg">Explore Markify</CardTitle>
                <CardDescription>
                  Learn more about features, pricing, and product updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button asChild variant="outline">
                  <Link href="/pricing">Pricing</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/blog">Blog</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Contact</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {solution.faqs?.length ? (
          <section className="container mx-auto px-4 pb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Frequently asked questions
              </h2>
              <div className="grid gap-4">
                {solution.faqs.map((faq) => (
                  <Card key={faq.question} className="border-border/60 bg-card/70">
                    <CardHeader>
                      <CardTitle className="text-base">{faq.question}</CardTitle>
                      <CardDescription>{faq.answer}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Related solutions</h2>
              <Button asChild variant="ghost">
                <Link href="/solutions">All solutions</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedSolutions.map((related) => (
                <Card key={related.slug} className="border-border/60 bg-card/70">
                  <CardHeader>
                    <CardTitle className="text-lg">{related.title}</CardTitle>
                    <CardDescription>{related.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={getSolutionPath(related.slug)}>View solution</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Solution;
