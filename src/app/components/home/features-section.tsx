import React from "react";
import OrangeButton from "../orange-button";

const TITLE_STYLE =
  "flex text-[24px] md:text-[48px] font-medium text-darkest-green mb-10";

const DESC_STYLE = "text-[14px] md:text-[24px] p-4 md:p-10 font-medium";

const FeaturesSection = () => {
  return (
    <div>
      <h1 className="text-darkest-green text-[32px] md:text-[49px] mb-8 text-left">
        Our Features
      </h1>
      <div className="flex justify-center items-center gap-4 p-4">
        <div className=" aspect-square w-full max-w-lg  flex items-center justify-center text-center">
          <div>
            <h2 className={TITLE_STYLE}>
              Healthcare <br />
              Transition Quiz
            </h2>
            <OrangeButton href="/" label="Health Quiz" />
          </div>
        </div>
        <div className="relative aspect-square w-full max-w-lg">
          {/* Solid shadow block */}
          <div className="absolute inset-0 bg-darkest-green translate-x-3 translate-y-3 z-0"></div>

          {/* Foreground content block */}
          <div className="relative z-10 text-primary-white bg-medium-green h-full w-full flex items-center justify-center text-center">
            <div>
              <p className={DESC_STYLE}>
                Don't know what level of help you need?
                <br />
                <br />
                Take this Transition Quiz that will guide you through the
                process of identifying the right level of care based on your
                loved one's current health situation.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 px-4 mb-8">
        <div className="relative aspect-square w-full max-w-lg">
          {/* Solid shadow block */}
          <div className="absolute inset-0 bg-medium-green -translate-x-3 translate-y-3 z-0"></div>

          {/* Foreground content block */}
          <div className="relative z-10 text-primary-white bg-darkest-green h-full w-full flex items-center justify-center text-center">
            <div>
              <p className={DESC_STYLE}>
                Don't know what level of help you need?
                <br />
                <br />
                Take this Transition Quiz that will guide you through the
                process of identifying the right level of care based on your
                loved one's current health situation.
              </p>
            </div>
          </div>
        </div>
        <div className=" aspect-square w-full max-w-lg  flex items-center justify-center text-center">
          <div>
            <h2 className={TITLE_STYLE}>
              Personalized <br />
              Healthcare Directory
            </h2>
            <OrangeButton href="/" label="Find a Healthcare Provider" />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center gap-4 px-4 mb-8">
        <div className=" aspect-square w-full max-w-lg  flex items-center justify-center text-center">
          <div>
            <h2 className={TITLE_STYLE}>
              Healthcare <br />
              Resources Hub
            </h2>
            <OrangeButton href="/" label="Health Quiz" />
          </div>
        </div>
        <div className="relative aspect-square w-full max-w-lg">
          {/* Solid shadow block */}
          <div className="absolute inset-0 bg-darkest-green translate-x-3 translate-y-3 z-0"></div>

          {/* Foreground content block */}
          <div className="relative z-10 text-primary-white bg-medium-green h-full w-full flex items-center justify-center text-center">
            <div>
              <p className={DESC_STYLE}>
                Want to learn more about your health?
                <br />
                Browse dozen of health care topics in several languages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
