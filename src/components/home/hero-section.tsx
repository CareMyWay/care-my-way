import React from "react";
import OrangeButton from "../buttons/orange-button";

const HeroSection = () => {
  return (
    <div className="bg-hero-section md:bg-hero-section bg-bottom h-screen ">
      <div className="w-full flex items-start bg-linear-to-r from-white to-none">
        <div className="container mx-auto mb-40 flex items-center h-screen">
          <div className="flex flex-col px-4 md:px-10 gap-4">
            <h1
              style={{ textShadow: "2px 2px 20px rgba(255, 255, 255, 0.8)" }}
              className=" text-darkest-green font-bold text-[35px] md:text-h2-size lg:text-h1-size"
            >
              Needing healthcare
              <br />
              help at home can happen
              <br />
              when you least expect it.
            </h1>
            <OrangeButton variant="route" href="/provider" className="w-fit">
              Find a Healthcare Provider
            </OrangeButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
