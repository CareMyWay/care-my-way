import React from "react";
import OrangeButton from "../buttons/orange-button";

const TITLE_STYLE =
  "flex text-body2-size md:text-h3-size font-medium text-darkest-green mb-10";
const DESC_STYLE =
  "text-body4-size md:text-body3-size lg:text-body2-size p-6 md:p-10 font-medium";

const features = [
  {
    id: 1,
    title: "Healthcare Transition Quiz",
    description:
      "Don't know what level of help you need?\n\nTake this Transition Quiz that will guide you through the process of identifying the right level of care based on your loved one's current health situation.",
    buttonLabel: "Health Quiz",
    buttonHref: "/",
    bgColor: "bg-medium-green",
    shadowColor: "bg-darkest-green",
    reverse: false,
  },
  {
    id: 2,
    title: "Personalized Healthcare Directory",
    description:
      "Don't know what level of help you need?\n\nTake this Transition Quiz that will guide you through the process of identifying the right level of care based on your loved one's current health situation.",
    buttonLabel: "Directory",
    buttonHref: "/",
    bgColor: "bg-darkest-green",
    shadowColor: "bg-medium-green",
    reverse: true,
  },
  {
    id: 3,
    title: "Healthcare Resources Hub",
    description:
      "Want to learn more about your health?\n\nBrowse dozens of healthcare topics in several languages.",
    buttonLabel: "Resources",
    buttonHref: "/",
    bgColor: "bg-medium-green",
    shadowColor: "bg-darkest-green",
    reverse: false,
  },
];

const FeaturesSection = () => {
  return (
    <div className="my-20">
      <div className="px-4 flex justify-center">
        <h1 className="text-darkest-green text-body1-size md:text-h3-size mb-20  text-center w-full max-w-6xl font-medium">
          Our Features
        </h1>
      </div>

      {features.map(
        ({
          id,
          title,
          description,
          buttonLabel,
          buttonHref,
          bgColor,
          shadowColor,
          reverse,
        }) => (
          // index
          <div
            key={id}
            className={`flex ${
              reverse ? "flex-col md:flex-row-reverse" : "flex-col md:flex-row"
            } justify-center items-center gap-4 px-4`}
            // className={`${reverse ? "flex-col-reverse" : ""} ${COL_STYLE}`}
          >
            <div className="aspect-square w-full max-w-lg flex items-center justify-center text-center">
              <div>
                <h2 className={TITLE_STYLE}>
                  {title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </h2>
                <OrangeButton
                  variant="route"
                  href={buttonHref}
                  label={buttonLabel}
                />
              </div>
            </div>
            <div className="relative aspect-square w-full max-w-lg">
              {/* Shadow block - hidden in mobile */}
              <div
                className={`sm:block hidden absolute inset-0 ${
                  reverse
                    ? "-translate-x-3 translate-y-3"
                    : "translate-x-3 translate-y-3"
                } ${shadowColor}  z-0`}
              ></div>

              {/* Content block */}
              <div
                className={`relative z-10 text-primary-white ${bgColor} h-full w-full flex items-center justify-center text-center`}
              >
                <div>
                  <p className={DESC_STYLE}>
                    {description.split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default FeaturesSection;
