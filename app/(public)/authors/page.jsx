import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/seo";
import { getAuthorDirectory } from "@/lib/content/authors";

export const revalidate = 3600;
export const runtime = "nodejs";

export const metadata = buildMetadata({
  title: "Authors",
  description:
    "Meet the Markify authors and editors behind our bookmark workflow guides, comparisons, and implementation playbooks.",
  path: "/authors",
  keywords: ["markify authors", "editorial team", "bookmark guides"],
});

export default async function Page() {
  const authors = await getAuthorDirectory();
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Authors", path: "/authors" },
  ]);
  const itemListSchema = buildItemListSchema(
    authors.map((author) => ({
      name: author.name,
      path: `/authors/${author.slug}`,
    })),
    { name: "Markify authors" }
  );
  const webPageSchema = buildWebPageSchema({
    title: "Markify authors",
    description:
      "Author directory for Markify content, including updated posts and topic coverage.",
    path: "/authors",
    type: "CollectionPage",
  });

  return (
    <>
      <StructuredData data={[webPageSchema, breadcrumbs, itemListSchema].filter(Boolean)} />
      <Navbar />
      <main className="bg-background text-foreground min-h-screen pt-24 pb-20">
        <section className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Authors</h1>
            <p className="mt-4 text-muted-foreground">
              Editorial contributors and specialists publishing practical bookmark workflows.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
            {authors.map((author) => (
              <article key={author.id} className="rounded-2xl border border-border/70 bg-card/70 p-6">
                <p className="text-sm font-semibold text-primary">{author.postCount} published posts</p>
                <h2 className="mt-2 text-xl font-semibold">{author.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{author.bio}</p>
                <Link
                  href={`/authors/${author.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                >
                  View author page
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
