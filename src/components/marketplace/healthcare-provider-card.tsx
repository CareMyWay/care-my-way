import React, { useState, useEffect } from "react";
import Image from "next/image";
import OrangeButton from "@/components/buttons/orange-button";
import { getFileUrl } from "@/utils/s3-upload";

interface HealthcareProviderCardProps {
  id?: string;
  name: string;
  title: string;
  location: string;
  experience: string;
  languages: string[];
  services: string[];
  hourlyRate: number;
  imageSrc: string | null;
}

const HealthcareProviderCard: React.FC<HealthcareProviderCardProps> = ({
  id,
  name,
  title,
  location,
  experience,
  languages,
  services,
  hourlyRate,
  imageSrc,
}) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  // For now, link to a generic provider page
  const profileLink = id ? `/provider/${id}` : "/provider";

  // Helper function to get initials from name
  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
  };

  // Load profile photo from S3 if it's an S3 key
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!imageSrc) {
        setProfilePhotoUrl(null);
        return;
      }

      // Check if it's already a full URL (starts with http)
      if (imageSrc.startsWith("http")) {
        setProfilePhotoUrl(imageSrc);
        return;
      }

      // Assume it's an S3 key, get signed URL
      try {
        setIsLoadingPhoto(true);
        const signedUrl = await getFileUrl(imageSrc, 3600); // 1 hour expiry
        if (signedUrl) {
          setProfilePhotoUrl(signedUrl);
        } else {
          setProfilePhotoUrl(null);
        }
      } catch (error) {
        console.error("Error loading profile photo:", error);
        setProfilePhotoUrl(null);
      } finally {
        setIsLoadingPhoto(false);
      }
    };

    loadProfilePhoto();
  }, [imageSrc]);

  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-6 p-6 bg-primary-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
      {/* Left Section: Image and Info */}
      <div className="flex flex-col md:flex-row flex-1 gap-4">
        {/* Image Block */}
        <div className="relative w-full md:w-[250px] h-[222px] rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0 bg-gray-100 flex items-center justify-center">
          {profilePhotoUrl ? (
            <Image
              src={profilePhotoUrl}
              alt={`${name}'s profile photo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] flex items-center justify-center rounded-lg">
              {isLoadingPhoto ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
              ) : (
                <span className="text-white text-4xl font-bold">
                  {getInitials(name)}
                </span>
              )}
            </div>
          )}
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
              {experience} experience
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
          href={profileLink}
          className="!px-4 !py-1.5 !text-md mt-4"
        >
          View Profile
        </OrangeButton>
      </div>
    </div>
  );
};

export default HealthcareProviderCard;