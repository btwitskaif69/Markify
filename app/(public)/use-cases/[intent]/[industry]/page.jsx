/* eslint-disable react/prop-types */
import UseCaseDetail from "@/app/(public)/_components/UseCaseDetail";
import StructuredData from "@/components/SEO/StructuredData";
import {
  getPseoPageBySlugs,
  getPseoQualitySignals,
  getPseoStaticParams,
} from "@/lib/pseo";
import { buildPseoMetadata, buildPseoStructuredData } from "@/lib/seo/pseo";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export const generateStaticParams = async () => getPseoStaticParams();

export const generateMetadata = async ({ params }) => {
  const resolvedParams = await params;
  const intentSlug = resolvedParams?.intent;
  const industrySlug = resolvedParams?.industry;
  const page = getPseoPageBySlugs(intentSlug, industrySlug);

  if (!page) {
    return buildPseoMetadata({
      page: null,
      title: "Use case not found",
      description: "The requested use-case page could not be found.",
      path: `/use-cases/${intentSlug || ""}/${industrySlug || ""}`,
      noindex: true,
      nofollow: true,
    });
  }

  const quality = getPseoQualitySignals(page);
  return buildPseoMetadata({ page, quality });
};

export default async function Page({ params }) {
  const resolvedParams = await params;
  const intentSlug = resolvedParams?.intent;
  const industrySlug = resolvedParams?.industry;
  const page = getPseoPageBySlugs(intentSlug, industrySlug);
  if (!page) return notFound();

  const structuredData = buildPseoStructuredData(page);

  return (
    <>
      <StructuredData data={structuredData} />
      <UseCaseDetail page={page} />
    </>
  );
}
