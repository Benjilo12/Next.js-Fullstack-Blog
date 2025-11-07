import { FilterableBlogSection } from "./components/FilterableBlogSection";
import { Suspense } from "react";
import HeroSection from "./components/HeroSection";
import BlogSectionSkeleton from "./components/BlogSectionSkeleton";
import NewsletterSection from "./components/NewsletterSection";

function Home() {
  return (
    <div className="">
      <HeroSection />
      <Suspense fallback={<BlogSectionSkeleton />}>
        <FilterableBlogSection />
      </Suspense>
      <NewsletterSection />
    </div>
  );
}

export default Home;
