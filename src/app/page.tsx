import { TopNavBar } from "@/components/navbars/TopNavBar";
import "@/app/globals.css";

import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection"; // Adjust the path as necessary
import FeaturesSection from "@/components/home/FeaturesSection";

export default function Home() {
  return (
    <div>
      <main>
        {/* Temp location of top navbar */}
        <TopNavBar />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
      </main>
    </div>
  );
}
