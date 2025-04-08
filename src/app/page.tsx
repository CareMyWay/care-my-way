import { TopNavBar } from "@/app/components/top-navbar";
import "@/app/globals.css";

import HeroSection from "@/app/components/home/hero-section";
import AboutSection from "@/app/components/home/about-section"; // Adjust the path as necessary

export default function Home() {
  return (
    <div>
      <main>
        {/* Temp location of top navbar */}
        <TopNavBar />
        <HeroSection />
        <AboutSection />
      </main>
    </div>
  );
}
