// app/search/SearchResults.jsx
"use client";

import { use } from "react";
import SearchContent from "./SearchContent";

export default function SearchResults({ searchParams }) {
  // Use React.use() to unwrap the Promise in Next.js 15
  const params = use(searchParams);

  return (
    <SearchContent
      initialParams={{
        searchTerm: params.searchTerm || "",
        sort: params.sort || "desc",
        category: params.category || "all",
      }}
    />
  );
}
