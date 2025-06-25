import React from "react";
import Image from "next/image";
import OrangeButton from "@/components/buttons/orange-button";

interface HealthcareProviderCardProps {
  name: string;
  title: string;
  location: string;
  experience: string;
  testimonials: number;
  languages: string[];
  services: string[];
  hourlyRate: number;
  imageSrc: string;
}

const HealthcareProviderCard: React.FC<HealthcareProviderCardProps> = ({
  name,
  title,
  location,
  experience,
  testimonials,
  languages,
  services,
  hourlyRate,
  imageSrc,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 p-6 bg-primary-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      {/* Left Section: Image and Info */}
      <div className="flex flex-col md:flex-row flex-1 gap-4">
        {/* Image Block */}
        <div className="relative w-full md:w-[250px] h-[222px] rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0">
          <Image
            src={imageSrc}
            alt={`${name}'s profile photo`}
            fill
            className="object-cover"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-between mt-4 md:mt-0">
          <div>
            <h3 className="text-h5-size font-semibold text-darkest-green">
              {name}
            </h3>
            <p className="text-body4-size text-medium-green">
              {title} | {location}
            </p>
            <p className="text-body4-size text-darkest-green mt-1">
              {experience} | {testimonials} testimonials
            </p>
            <p className="text-body4-size text-darkest-green">
              {languages.join(", ")}
            </p>

            {/* Services */}
            <p className="text-body4-size text-darkest-green mt-2 mb-1 font-semibold">
              Services:
            </p>
            <div className="flex flex-wrap gap-2">
              {services.slice(0, 3).map((service, idx) => (
                <span
                  key={idx}
                  className="bg-light-green text-darkest-green px-3 py-1 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
              {services.length > 3 && (
                <span className="text-body4-size text-medium-green font-medium">
                  more...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Rate and Button */}
      <div className="flex flex-col md:items-end md:text-right text-left items-start justify-between shrink-0 mt-6 md:mt-0 w-full md:w-40">
        <div className="text-body4-size text-darkest-green">
          <span className="block text-sm">Starting From</span>
          <span className="text-h5-size font-bold">${hourlyRate}/hr</span>
        </div>
        <OrangeButton
          variant="route"
          href="/provider" // Replace with actual profile link
          className="!px-4 !py-1.5 !text-md mt-4"
        >
          View Profile
        </OrangeButton>
      </div>
    </div>
  );
};

export default HealthcareProviderCard;