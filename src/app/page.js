import { FilterableBlogSection } from "./components/FilterableBlogSection";
import HeroSection from "./components/HeroSection";

function Home() {
  return (
    <div className="">
      <HeroSection />
      <FilterableBlogSection />
    </div>
  );
}

export default Home;
