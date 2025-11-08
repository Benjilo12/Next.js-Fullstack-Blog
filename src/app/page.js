import { FilterableBlogSection } from "./components/FilterableBlogSection";
import { Suspense } from "react";
import HeroSection from "./components/HeroSection";
import BlogSectionSkeleton from "./components/BlogSectionSkeleton";
import NewsletterSection from "./components/NewsletterSection";
import AboutBlogSection from "./components/AboutBlogSection";

function Home() {
  return (
    <div className="">
      <HeroSection />
      <Suspense fallback={<BlogSectionSkeleton />}>
        <FilterableBlogSection />
      </Suspense>
      <AboutBlogSection />
      <NewsletterSection />
    </div>
  );
}

export default Home;
