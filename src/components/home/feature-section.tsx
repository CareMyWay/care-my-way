import React from "react";
import OrangeButton from "../buttons/orange-button";
import { CalendarCheck, ShieldCheck, Users } from "lucide-react"; // Example Lucide icons

const features = [
  {
    id: 1,
    title: "Effortless Booking",
    description:
      "Book a care provider in seconds. Our intuitive platform makes finding help as easy as tapping a button.",
    buttonLabel: "Book Now",
    buttonHref: "/",
    bgColor: "bg-medium-green",
    borderColor: "border-medium-green",
    outlineColor: "border-darkest-green",
    icon: <CalendarCheck size={48} className="text-primary-white mb-4" />,
    reverse: false,
  },
  {
    id: 2,
    title: "Verified Professionals",
    description:
      "Every provider is background-checked and verified, so you can trust the care you receive.",
    buttonLabel: "Meet Providers",
    buttonHref: "/marketplace",
    bgColor: "bg-darkest-green",
    borderColor: "border-darkest-green",
    outlineColor: "border-medium-green",
    icon: <ShieldCheck size={48} className="text-primary-white mb-4" />,
    reverse: true,
  },
  {
    id: 3,
    title: "Personalized Matches",
    description:
      "Get matched with providers who fit your unique needs and preferences, every time.",
    buttonLabel: "Find Your Match",
    buttonHref: "/",
    bgColor: "bg-medium-green",
    borderColor: "border-medium-green",
    outlineColor: "border-darkest-green",
    icon: <Users size={48} className="text-primary-white mb-4" />,
    reverse: false,
  },
];

const DESC_STYLE =
  "text-base md:text-lg lg:text-xl font-medium text-primary-white break-words max-w-full";
const BOX_SIZE = "w-full h-64 md:w-[370px] md:h-[320px]";

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="px-4 flex justify-center">
        <h1 className="text-darkest-green text-3xl md:text-4xl font-bold mb-16 text-center w-full max-w-6xl">
          Our Features
        </h1>
      </div>

      <div className="flex flex-col gap-20">
        {features.map(
          ({
            id,
            title,
            description,
            buttonLabel,
            buttonHref,
            bgColor,
            borderColor,
            outlineColor,
            icon,
            reverse,
          }) => (
            <div
              key={id}
              className={`flex ${
                reverse
                  ? "flex-col md:flex-row-reverse"
                  : "flex-col md:flex-row"
              } justify-center items-center gap-8 md:gap-16 px-4 max-w-6xl mx-auto`}
            >
              <div className="w-full max-w-md flex items-center justify-center text-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-darkest-green mb-4">
                    {title}
                  </h2>
                  <OrangeButton
                    variant="route"
                    href={buttonHref}
                    className="mt-4 px-6 py-2 text-base"
                  >
                    {buttonLabel}
                  </OrangeButton>
                </div>
              </div>
              <div className="relative flex items-center justify-center w-full max-w-md">
                {/* Outline box behind, offset on the bottom */}
                <div
                  className={`
                    absolute
                    ${reverse ? "-bottom-4 -left-4" : "-bottom-4 -right-4"}
                    ${BOX_SIZE}
                    rounded-2xl
                    border-4
                    ${outlineColor}
                    z-0
                  `}
                  aria-hidden="true"
                ></div>
                {/* Main feature box */}
                <div
                  className={`
                    relative z-10
                    ${bgColor}
                    ${borderColor}
                    border-4
                    rounded-2xl
                    flex flex-col items-center justify-center
                    p-8 md:p-10
                    ${BOX_SIZE}
                  `}
                >
                  {icon}
                  <div className={DESC_STYLE}>{description}</div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default FeaturesSection;
