import React from "react";
import Link from "next/link";

const BUTTON_STYLE =
  "bg-primary-orange rounded-btn-radius font-btn-font-wgt text-primary-white px-6 py-3 md:text-btn-font-size text-[14px] shadow-md w-fit transition-all hover:bg-hover-orange";

const HeroSection = () => {
  return (
    <div className="bg-hero-section md:bg-hero-section bg-bottom">
      <div className="w-full h-screen flex items-start bg-linear-to-r from-white to-none">
        <div className="container mx-auto mb-40 flex items-center h-screen">
          <div className="flex flex-col px-4 md:px-10 gap-6">
            <h1 className=" text-darkest-green font-bold text-[38px] md:text-[70px]">
              Needing healthcare
              <br />
              help at home can happen
              <br />
              when you least expect it.
            </h1>
            <Link href="/" className={BUTTON_STYLE}>
              <button className="uppercase">Find a healthcare worker</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
