import "@/app/globals.css";

import HeroSection from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section"; // Adjust the path as necessary
import FeaturesSection from "@/components/home/feature-section";
import { MeetOurProviders } from "@/components/home/meet-provider-section";
import { HowItWorks } from "@/components/home/how-it-works";
import "@/app/amplify-config";

// import NavBar from "@/components/nav-bars/navbar";

export default async function Home() {
  return (
    <div>
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <MeetOurProviders />
        <HowItWorks />
        <ContactSection />
        {/* Temp location */}
        <Footer />
      </main>
    </div>
  );
}
