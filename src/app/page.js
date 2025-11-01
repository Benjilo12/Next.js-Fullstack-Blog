import { FilterableBlogSection } from "./components/FilterableBlogSection";
import { Suspense } from "react";
import HeroSection from "./components/HeroSection";
import BlogSectionSkeleton from "./components/BlogSectionSkeleton";

function Home() {
  return (
    <div className="">
      <HeroSection />
      <Suspense fallback={<BlogSectionSkeleton />}>
        <FilterableBlogSection />
      </Suspense>
    </div>
  );
}

export default Home;
