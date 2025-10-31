import { HyperText } from "@/components/ui/hyper-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { FlipWords } from "@/components/ui/flipwords";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";

export default function HeroSection() {
  return (
    <>
      <div className="relative mx-auto flex min-h-full max-w-7xl mt-12 md:mt-17 flex-col overflow-hidden px-4 pt-16 sm:px-6 sm:pt-20 md:pt-24 lg:px-8 lg:pt-25 xl:pt-30">
        {/* Email badge - reduced width */}
        <div className="inline-flex items-center justify-center px-2 py-0.5 mb-2 md:mb-3 border border-blue-400/70 bg-white/20 backdrop-blur-sm rounded-full text-md text-white shadow-sm dark:bg-emerald-400/10 dark:border-emerald-400-30 mx-auto">
          <AnimatedGradientText
            speed={2}
            colorFrom="#4ade80"
            colorTo="#06b6d4"
            className="text-1xl font-semibold tracking-tight"
          >
            Email: topblog@gmail.com
          </AnimatedGradientText>
        </div>

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
