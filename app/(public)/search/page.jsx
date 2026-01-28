import SearchPage from "@/app/(public)/_components/Search";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Search",
  description: "Search Markify pages, features, and solutions.",
  path: "/search",
  noindex: true,
  nofollow: true,
});

export default function Page() {
  return <SearchPage />;
}
