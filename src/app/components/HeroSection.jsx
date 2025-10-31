import { HyperText } from "@/components/ui/hyper-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { FlipWords } from "@/components/ui/flipwords";

export default function HeroSection() {
  return (
    <>
      <div className="relative mx-auto flex min-h-full max-w-7xl  mt-12 md:mt-17 flex-col overflow-hidden px-4 pt-16 sm:px-6 sm:pt-20 md:pt-24 lg:px-8 lg:pt-25 xl:pt-30  ">
        <div>
          {/* Main Heading - Responsive sizing and spacing */}
          <div className="relative z-10 mx-auto mt-0 max-w-6xl text-center text-2xl font-semibold text-black sm:mt-6 sm:text-4xl md:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl dark:text-white">
            <AuroraText className="mb-2"> Blogging Without </AuroraText>
            <FlipWords
              words={["Boundaries•", "Limits•", "Rules•", "Borders•"]}
              duration={5000}
              className="text-blue-600 dark:text-sky-400"
            />
          </div>

          {/* Subtitle - Responsive sizing and spacing */}

          <HyperText className="relative z-10 mx-auto mt-4 max-w-2xl text-center text-sm text-neutral-700 sm:mt-6 sm:text-base md:max-w-3xl md:text-lg lg:text-xl dark:text-neutral-400 mb-4">
            This is my space to think out loud, share what matters to me, and
            write straight from the heart. Whether it&apos;s a fleeting thought
            or a deeper dive, my story unfolds right here. I&apos;m glad
            you&apos;re along for the journey.
          </HyperText>
        </div>
      </div>
    </>
  );
}
