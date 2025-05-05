import "@/app/globals.css";

import { TopNavBar } from "@/components/navbars/top-navbar";
import HeroSection from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section"; // Adjust the path as necessary
import FeaturesSection from "@/components/home/feature-section";

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
