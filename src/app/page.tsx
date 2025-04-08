import { TopNavBar } from "@/app/components/top-navbar";
import "@/app/globals.css";

import HeroSection from "@/app/components/home/hero-section";

export default function Home() {
  return (
    <div>
      <main>
        {/* Temp location of top navbar */}
        <TopNavBar />
        <HeroSection />
      </main>
    </div>
  );
}
