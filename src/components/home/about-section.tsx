import React from "react";
import GreenButton from "../buttons/green-button";

const AboutSection = () => {
  return (
    <section className="bg-medium-green py-20 md:py-32">
      <div className="container mx-auto flex flex-col items-center px-4 max-w-3xl">
        <p className="text-primary-white text-center text-lg md:text-2xl mb-10">
          Find Compassionate Care, Simplified.
          <br />
          Whether you’re searching for a reliable healthcare aid or looking
          to offer your services, Care My Way makes the process effortless.
          We provide a trusted platform where families can connect with
          qualified healthcare aids who match your unique needs.
        </p>
        <GreenButton
          href="/"
          variant="route"
          className="text-lg px-8 py-3"
          label="Find a Healthcare provider"
        >
          Find a Healthcare provider
        </GreenButton>
      </div>
    </section>
  );
};

export default AboutSection;
