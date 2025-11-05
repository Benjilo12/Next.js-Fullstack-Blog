// app/search/page.js
import { Suspense } from "react";
import SearchContent from "./SearchContent";
import { SearchSkeleton } from "./SearchSkeleton";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
