"use client";
import { FilterableBlogSection } from "./components/FilterableBlogSection";
import { Suspense } from "react";
import HeroSection from "./components/HeroSection";
import BlogSectionSkeleton from "./components/BlogSectionSkeleton";
import NewsletterSection from "./components/NewsletterSection";
import AboutBlogSection from "./components/AboutBlogSection";
import Footer from "./components/Footer";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Home() {
  useEffect(() => {
    const initAOS = async () => {
      await import("aos");
      AOS.init({
        duration: 1000,
        easing: "ease",
        once: true,
        anchorPlacement: "top-bottom",
      });
    };
    initAOS();
  }, []);
  return (
    <div className="">
      <HeroSection />
      <Suspense fallback={<BlogSectionSkeleton />}>
        <FilterableBlogSection />
      </Suspense>
      <AboutBlogSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default Home;
