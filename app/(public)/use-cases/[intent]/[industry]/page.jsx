import UseCaseDetail from "@/app/(public)/_components/UseCaseDetail";
import StructuredData from "@/components/SEO/StructuredData";
import {
  getPseoHubPath,
  getPseoPageBySlugs,
  getPseoStaticParams,
  getPseoQualitySignals,
} from "@/lib/pseo";
import { buildPseoMetadata, buildPseoStructuredData } from "@/lib/seo/pseo";
import { notFound } from "next/navigation";

export const revalidate = 86400;

export const dynamicParams = true;

export const generateStaticParams = () => {
  const env = globalThis?.process?.env || {};
  const limit = Number(env.PSEO_BUILD_LIMIT || 500);
  const offset = Number(env.PSEO_BUILD_OFFSET || 0);
  return getPseoStaticParams({ limit, offset });
};

export const generateMetadata = ({ params }) => {
  const page = getPseoPageBySlugs(params.intent, params.industry);
  if (!page) {
    return buildPseoMetadata({
      title: "Use case not found",
      description: "The requested use case could not be found.",
      path: getPseoHubPath(),
      noindex: true,
      nofollow: true,
    });
  }

  const quality = getPseoQualitySignals(page);

  return buildPseoMetadata({ page, quality });
};

export default function Page({ params }) {
  const page = getPseoPageBySlugs(params.intent, params.industry);
  if (!page) return notFound();

  const structuredData = buildPseoStructuredData(page);

  return (
    <>
      <StructuredData data={structuredData} />
      <UseCaseDetail page={page} />
    </>
  );
}
