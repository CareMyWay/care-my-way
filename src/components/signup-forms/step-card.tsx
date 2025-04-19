import React from "react";
import OrangeButton from "@/components/buttons/orange-button";

interface StepCardProps {
  stepNum: number;
  title: string;
  subtitle: string;
  href: string;
}

export const StepCard: React.FC<StepCardProps> = ({
  stepNum,
  title,
  subtitle,
  href,
}) => {
  return (
    <div className="relative flex flex-col  md:flex-row justify-between items-start md:items-center border border-gray-300 rounded-md px-4 py-6 mb-4 shadow-sm w-full">
      {/* Step Number */}
      <div className="absolute top-6 left-4 md:static md:mr-3">
        <div className="bg-medium-green text-primary-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-lg font-semibold shrink-0">
          {stepNum}
        </div>
      </div>

      {/* Text Content */}
      <div className="pl-16 md:pl-0 flex-1 mb-4 md:mb-0">
        <h3 className="text-body4-size font-semibold text-darkest-green text-left">
          {title}
        </h3>
        <p className="text-body5-size text-gray-500  text-left">{subtitle}</p>
      </div>

      {/* Button */}
      <OrangeButton
        variant="route"
        href={href}
        label="Start"
        className="px-10 md:px-20 self-center md:self-auto"
      />
    </div>
  );
};
