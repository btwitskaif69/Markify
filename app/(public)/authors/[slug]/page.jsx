import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StructuredData from "@/components/SEO/StructuredData";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  getCanonicalUrl,
} from "@/lib/seo";
import { getAuthorBySlug, getAuthorDirectory } from "@/lib/content/authors";

export const revalidate = 3600;
export const dynamicParams = true;
export const runtime = "nodejs";

export const generateStaticParams = async () => {
  const authors = await getAuthorDirectory();
  return authors.map((author) => ({ slug: author.slug }));
};

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const author = await getAuthorBySlug(resolvedParams?.slug);

  if (!author) {
    return buildMetadata({
      title: "Author not found",
      description: "The requested author page could not be found.",
      path: "/authors",
      noindex: true,
      nofollow: true,
    });
  }

  return buildMetadata({
    title: `${author.name} - Author`,
    description: `${author.name} has published ${author.postCount} article${author.postCount === 1 ? "" : "s"} on bookmark workflows and implementation best practices.`,
    path: `/authors/${author.slug}`,
    keywords: ["author profile", "markify author", author.name],
  });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const author = await getAuthorBySlug(resolvedParams?.slug);
  if (!author) return notFound();

  const path = `/authors/${author.slug}`;
  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Authors", path: "/authors" },
    { name: author.name, path },
  ]);
  const authoredPosts = buildItemListSchema(
    author.posts.map((post) => ({
      name: post.title,
      path: `/blog/${post.slug}`,
    })),
    { name: `${author.name} posts` }
  );
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description: author.bio,
    url: getCanonicalUrl(path),
    image: author.avatar || undefined,
    hasOccupation: {
      "@type": "Occupation",
      name: "Content Author",
    },
  };

  return (
    <>
      <StructuredData data={[personSchema, breadcrumbs, authoredPosts].filter(Boolean)} />
      <Navbar />
      <main className="bg-background text-foreground min-h-screen pt-24 pb-20">
        <section className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl rounded-2xl border border-border/70 bg-card/70 p-8">
            <p className="text-sm text-primary">Author profile</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight">{author.name}</h1>
            <p className="mt-4 text-muted-foreground">{author.bio}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {author.postCount} published article{author.postCount === 1 ? "" : "s"}
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-4xl gap-4">
            {author.posts.map((post) => (
              <article key={post.id} className="rounded-xl border border-border/70 bg-card/70 p-5">
                <Link href={`/blog/${post.slug}`} className="text-lg font-semibold hover:text-primary">
                  {post.title}
                </Link>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
