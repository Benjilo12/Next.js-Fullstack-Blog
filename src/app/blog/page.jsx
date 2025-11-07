import { Suspense } from "react";
import SkeletonList from "../components/SkeletonList";
import BlogContent from "./BlogContent";

export default function BlogPage() {
  return (
    <Suspense fallback={<SkeletonList />}>
      <BlogContent />
    </Suspense>
  );
}
