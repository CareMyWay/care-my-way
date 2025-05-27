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
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 p-6 bg-primary-white rounded-lg shadow-md">
      {/* Image */}
      <div className="w-full md:w-1/4 flex justify-center">
        <div className="relative w-28 h-28 rounded-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={`${name}'s profile photo`}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start flex-wrap gap-y-2">
          <div>
            <h3 className="text-h5-size font-semibold text-darkest-green">
              {name}
            </h3>
            <p className="text-body4-size text-darkest-green">
              {title} | {location}
            </p>
          </div>
          <div className="text-right text-darkest-green text-body4-size">
            <p className="font-semibold">
              Starting from ${hourlyRate}/hr
            </p>
          </div>
        </div>

        <div className="text-body4-size text-darkest-green">
          <p>
            <strong>Experience:</strong> {experience} | {testimonials} testimonials
          </p>
          <p>
            <strong>Languages:</strong> {languages.join(", ")}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
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

        <div className="pt-4">
          <OrangeButton variant="route" href="/">
            View Profile
          </OrangeButton>
        </div>
      </div>
    </div>
  );
};

export default HealthcareProviderCard;
