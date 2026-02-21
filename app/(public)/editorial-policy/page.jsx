import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Editorial Policy",
  description:
    "How Markify plans, reviews, updates, and cites content to support trustworthy SEO and AI-answer visibility.",
  path: "/editorial-policy",
  keywords: ["editorial policy", "content quality", "eeat", "markify standards"],
});

const principles = [
  "Every article starts with search intent mapping: problem, comparison, or question.",
  "Each page includes a question-first summary and a verifiable update timestamp.",
  "Claims with numbers must include a source citation and link to the original document.",
  "Content is reviewed for factual accuracy, internal links, and duplicate-canonical risk before publishing.",
  "Programmatic pages are audited weekly for thin content, duplication, and stale sections.",
];

export default function Page() {
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Editorial policy", path: "/editorial-policy" },
  ]);
  const webPageSchema = buildWebPageSchema({
    title: "Markify editorial policy",
    description:
      "Content governance standards used for SEO, GEO, citations, and ongoing quality review.",
    path: "/editorial-policy",
    type: "AboutPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs]} />
      <Navbar />
      <main className="bg-background text-foreground min-h-screen pt-24 pb-20">
        <section className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/70 bg-card/70 p-8">
            <h1 className="text-4xl font-bold tracking-tight">Editorial Policy</h1>
            <p className="mt-4 text-muted-foreground">
              This policy defines how Markify content is created and maintained for both
              traditional search engines and AI answer systems.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
              {principles.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
