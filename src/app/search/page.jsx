import { Suspense } from "react";
import SearchResults from "./SearchResults";
import { SearchSkeleton } from "./SearchSkeleton";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchResults searchParams={searchParams} />
    </Suspense>
  );
}
