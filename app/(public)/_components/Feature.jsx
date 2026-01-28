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
  getFeatureBySlug,
  getFeaturePath,
  getRelatedFeatures,
} from "@/data/features";
import { SOLUTIONS, getSolutionPath } from "@/data/solutions";

const Feature = () => {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
  const feature = getFeatureBySlug(slug);

  if (!feature) {
    return <NotFoundPage />;
  }

  const relatedFeatures = getRelatedFeatures(feature.slug);
  const relatedSolutions = SOLUTIONS.slice(0, 3);

  return (
    <>
      <Navbar />

      <main className="bg-background text-foreground min-h-screen">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
              {feature.hero.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              {feature.hero.heading}
            </h1>
            <p className="text-muted-foreground text-lg">
              {feature.hero.subheading}
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
            {feature.benefits.map((benefit) => (
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
                How teams use this feature
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                {feature.workflows.map((step) => (
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
                  Learn more about use cases, pricing, and product updates.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button asChild variant="outline">
                  <Link href="/solutions">Solutions</Link>
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

        {feature.faqs?.length ? (
          <section className="container mx-auto px-4 pb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Frequently asked questions
              </h2>
              <div className="grid gap-4">
                {feature.faqs.map((faq) => (
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

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Related features</h2>
              <Button asChild variant="ghost">
                <Link href="/features">All features</Link>
              </Button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedFeatures.map((related) => (
                <Card key={related.slug} className="border-border/60 bg-card/70">
                  <CardHeader>
                    <CardTitle className="text-lg">{related.title}</CardTitle>
                    <CardDescription>{related.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={getFeaturePath(related.slug)}>View feature</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-20">
          <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-3">
                  See Markify in real workflows
                </h2>
                <p className="text-muted-foreground">
                  Explore how different teams use Markify to organize the web.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {relatedSolutions.map((solution) => (
                  <Button key={solution.slug} asChild variant="outline">
                    <Link href={getSolutionPath(solution.slug)}>
                      {solution.title}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Feature;
