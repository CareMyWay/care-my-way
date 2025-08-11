import "@/app/globals.css";

import HeroSection from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section"; // Adjust the path as necessary
import FeaturesSection from "@/components/home/feature-section";
import { MeetOurProviders } from "@/components/home/meet-provider-section";
import { HowItWorks } from "@/components/home/how-it-works";
import HomeFooter from "@/components/footers/home-footer"; // Adjust the path as necessary
import ContactSection from "@/components/home/contact-section";
import "@/app/amplify-config";

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
        <HomeFooter />
      </main>
    </div>
  );
}
