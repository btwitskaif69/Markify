import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO/SEO";
import NotFoundPage from "@/components/NotFoundPage";
import PseoPageTemplate from "@/components/pseo/PseoPageTemplate";
import {
  getPseoHubPath,
  getPseoIntentPath,
  getPseoPageBySlugs,
} from "@/lib/pseo";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildItemListSchema,
  getCanonicalUrl,
} from "@/lib/seo";

const UseCaseDetail = () => {
  const { intent: intentSlug, industry: industrySlug } = useParams();
  const page = getPseoPageBySlugs(intentSlug, industrySlug);

  if (!page) {
    return <NotFoundPage />;
  }

  const canonical = getCanonicalUrl(page.path);
  const structuredData = useMemo(() => {
    const breadcrumbs = buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Use cases", path: getPseoHubPath() },
      { name: page.intent.title, path: getPseoIntentPath(page.intent.slug) },
      { name: page.industry.name, path: page.path },
    ]);
    const faqSchema = buildFaqSchema(page.faqs);
    const relatedItems = [
      ...page.related.intents.map((intent) => ({
        name: `${intent.title} for ${page.industry.name}`,
        path: `/use-cases/${intent.slug}/${page.industry.slug}`,
      })),
      ...page.related.industries.map((industry) => ({
        name: `${page.intent.title} for ${industry.name}`,
        path: `/use-cases/${page.intent.slug}/${industry.slug}`,
      })),
    ];
    const relatedSchema = buildItemListSchema(relatedItems, {
      name: `${page.intent.title} related pages`,
    });
    return [breadcrumbs, faqSchema, relatedSchema].filter(Boolean);
  }, [page]);

  return (
    <>
      <SEO
        title={page.title}
        description={page.description}
        canonical={canonical}
        keywords={page.keywords}
        structuredData={structuredData}
        webPageType="CollectionPage"
      />
      <Navbar />
      <PseoPageTemplate page={page} />
      <Footer />
    </>
  );
};

export default UseCaseDetail;
