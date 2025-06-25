import React from "react";
import GreenButton from "../buttons/green-button";

const AboutSection = () => {
  return (
<<<<<<< HEAD
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
=======
    <div className="bg-medium-green p-14 md:p-24 ">
      <div className="w-full flex">
        <div className="container mx-auto  flex items-center ">
          <div className="flex flex-col px-2 md:px-10 items-center gap-12">
            <p className="text-primary-white text-center text-body4-size md:text-body1-size ">
              Find Compassionate Care, Simplified.
              <br />
              Whether you’re searching for a reliable healthcare aid or looking
              to offer your services, Care My Way makes the process effortless.
              We provide a trusted platform where families can connect with
              qualified healthcare aids who match your unique needs.
            </p>
            <GreenButton href="/provider" variant="route">
              Find a Healthcare provider
            </GreenButton>
          </div>
        </div>
>>>>>>> cf39c46 (Put together marketplace page and connected links to provider to the provider page UI)
      </div>
    </section>
  );
};

export default AboutSection;
