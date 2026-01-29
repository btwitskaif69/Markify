import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getPseoHubPath,
  getPseoIntentPath,
  getPseoDetailPath,
} from "@/lib/pseo";
import {
  buildKeywordContext,
  getRelatedFeatureLinks,
  getRelatedSolutionLinks,
} from "@/lib/seo/internal-links";

const PseoPageTemplate = ({ page }) => {
  if (!page) return null;
  const { intent, industry, hero, summary, benefits, workflow, useCases, faqs } =
    page;
  const keywordContext = buildKeywordContext(
    page.keywords,
    intent.title,
    intent.primaryKeyword,
    intent.description,
    industry.name,
    industry.description,
    industry.keywords
  );
  const relatedFeatures = getRelatedFeatureLinks(keywordContext, { limit: 3 });
  const relatedSolutions = getRelatedSolutionLinks(keywordContext, { limit: 3 });

  return (
    <main className="bg-background text-foreground min-h-screen">
      <section className="container mx-auto px-4 py-12 md:py-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getPseoHubPath()}>Use cases</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getPseoIntentPath(intent.slug)}>{intent.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{industry.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-4xl mx-auto text-center mt-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {hero.heading}
          </h1>
          <p className="text-muted-foreground text-lg">{hero.subheading}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href={page.cta.href}>{page.cta.label}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto grid gap-4">
          {summary.map((paragraph) => (
            <p key={paragraph} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Why {industry.name} teams rely on Markify
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-border/60 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  <CardDescription>{benefit.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">
              A {intent.title.toLowerCase()} workflow that stays organized
            </h2>
            <ul className="space-y-3 text-muted-foreground">
              {workflow.map((step) => (
                <li key={step} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-lg">Team-ready outcomes</CardTitle>
              <CardDescription>
                Built for {industry.name} teams that need fast access to shared
                context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Key metrics
                </p>
                <ul className="space-y-2">
                  {industry.metrics.map((metric) => (
                    <li key={metric} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Teams served
                </p>
                <ul className="space-y-2">
                  {industry.personas.map((persona) => (
                    <li key={persona} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{persona}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Collections {industry.name} teams build
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {useCases.map((useCase) => (
              <Card key={useCase.title} className="border-border/60 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {relatedFeatures.length || relatedSolutions.length ? (
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
            {relatedFeatures.length ? (
              <Card className="border-border/60 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">Related features</CardTitle>
                  <CardDescription>
                    Explore product capabilities that support this workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {relatedFeatures.map((feature) => (
                    <Button key={feature.href} asChild variant="outline" size="sm">
                      <Link href={feature.href}>{feature.label}</Link>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ) : null}

            {relatedSolutions.length ? (
              <Card className="border-border/60 bg-card/70">
                <CardHeader>
                  <CardTitle className="text-lg">Related solutions</CardTitle>
                  <CardDescription>
                    See how other teams apply Markify in their workflows.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {relatedSolutions.map((solution) => (
                    <Button
                      key={solution.href}
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <Link href={solution.href}>{solution.label}</Link>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ) : null}
          </div>
        </section>
      ) : null}

      {faqs.length ? (
        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Frequently asked questions
            </h2>
            <div className="grid gap-4">
              {faqs.map((faq) => (
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

      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-lg">
                More {industry.name} use cases
              </CardTitle>
              <CardDescription>
                Explore other workflows for {industry.name} teams.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {page.related.intents.map((relatedIntent) => (
                <Button
                  key={relatedIntent.slug}
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link
                    href={getPseoDetailPath(relatedIntent.slug, industry.slug)}
                  >
                    {relatedIntent.title}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/70">
            <CardHeader>
              <CardTitle className="text-lg">
                {intent.title} in other industries
              </CardTitle>
              <CardDescription>
                Compare how other teams use Markify for {intent.title.toLowerCase()}
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {page.related.industries.map((relatedIndustry) => (
                <Button
                  key={relatedIndustry.slug}
                  asChild
                  variant="outline"
                  size="sm"
                >
                  <Link
                    href={getPseoDetailPath(intent.slug, relatedIndustry.slug)}
                  >
                    {relatedIndustry.name}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto rounded-2xl border border-border/60 bg-muted/30 p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-3">
            Ready to organize {intent.title.toLowerCase()}?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start free today or explore Markify features and pricing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href={page.cta.href}>{page.cta.label}</Link>
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
  );
};

export default PseoPageTemplate;
