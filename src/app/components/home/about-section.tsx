import React from "react";
import GreenButton from "../green-button";

const AboutSection = () => {
  return (
    <div className="bg-medium-green">
      <div className="w-full h-screen flex ">
        <div className="container mx-auto mb-40 flex items-center h-screen">
          <div className="flex flex-col px-6 md:px-20 items-center gap-12">
            <p className="text-primary-white text-center text-[24px] md:text-[32px] ">
              Find Compassionate Care, Simplified.
              <br />
              Whether you’re searching for a reliable healthcare aid or looking
              to offer your services, Care My Way makes the process effortless.
              We provide a trusted platform where families can connect with
              qualified healthcare aids who match your unique needs.
            </p>
            <GreenButton href="/" label="Find a Healthcare provider" />
          </div>
        </div>
      </div>
      //{" "}
    </div>
  );
};

export default AboutSection;
