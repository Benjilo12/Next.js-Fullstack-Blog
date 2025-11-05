// app/search/SearchResults.jsx
"use client";

import { use } from "react";
import SearchContent from "./SearchContent";

export default function SearchResults({ searchParams }) {
  const params = use(searchParams);

  return <SearchContent initialParams={params} />;
}
