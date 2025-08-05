"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, Edit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { getFileUrl } from "@/utils/s3-upload";

interface ProfileHeaderProps {
  profileData: ProviderProfileData;
}

export function ProfileHeader({ profileData }: ProfileHeaderProps) {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("/placeholder.svg?height=160&width=160");
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  // Helper function to get initials
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "P";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  // Helper function to format location
  const getLocation = () => {
    const parts = [profileData.city, profileData.province].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  // Load profile photo from S3 if it's an S3 key
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (!profileData.profilePhoto) {
        setProfilePhotoUrl("/placeholder.svg?height=160&width=160");
        return;
      }

      // Check if it's already a full URL (starts with http)
      if (profileData.profilePhoto.startsWith('http')) {
        setProfilePhotoUrl(profileData.profilePhoto);
        return;
      }

      // Assume it's an S3 key, get signed URL
      try {
        setIsLoadingPhoto(true);
        const signedUrl = await getFileUrl(profileData.profilePhoto, 3600); // 1 hour expiry
        if (signedUrl) {
          setProfilePhotoUrl(signedUrl);
        } else {
          setProfilePhotoUrl("/placeholder.svg?height=160&width=160");
        }
      } catch (error) {
        console.error('Error loading profile photo:', error);
        setProfilePhotoUrl("/placeholder.svg?height=160&width=160");
      } finally {
        setIsLoadingPhoto(false);
      }
    };

    loadProfilePhoto();
  }, [profileData.profilePhoto]);

  return (
    <Card className="border-none bg-gradient-to-br from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] text-white rounded-3xl overflow-hidden shadow-2xl">
      <CardContent className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">

          {/* Profile Info Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 flex-1">

            {/* Avatar */}
            <div className="relative">
              <Avatar className="!h-64 !w-64 border-4 border-white/30 shadow-2xl ring-4 ring-white/20">
                <AvatarImage
                  src={profilePhotoUrl}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="object-cover"
                />
                <AvatarFallback className="bg-white/20 text-white text-3xl font-bold backdrop-blur-sm">
                  {isLoadingPhoto ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/30 border-t-white"></div>
                  ) : (
                    getInitials(profileData.firstName, profileData.lastName)
                  )}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Details */}
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium">
                  {profileData.profileTitle || "Healthcare Provider"}
                </p>
              </div>

              {/* Info Pills */}
              <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">{getLocation()}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Responds {profileData.responseTime || "within 24 hours"}</span>
                </div>
                {profileData.askingRate && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="font-semibold text-lg">${profileData.askingRate}</span>
                    <span className="font-medium">per hour</span>
                  </div>
                )}
              </div>

              {/* Services and Languages */}
              <div className="space-y-3">
                {profileData.servicesOffered && profileData.servicesOffered.length > 0 && (
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-2">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData.servicesOffered.slice(0, 3).map((service, index) => (
                        <Badge key={index} className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs px-2 py-1">
                          {service}
                        </Badge>
                      ))}
                      {profileData.servicesOffered.length > 3 && (
                        <Badge className="bg-white/20 text-white border-white/30 text-xs px-2 py-1">
                          +{profileData.servicesOffered.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {profileData.languages && profileData.languages.length > 0 && (
                  <div>
                    <p className="text-white/70 text-sm font-medium mb-2">Languages:</p>
                    <div className="flex flex-wrap gap-2">
                      {profileData.languages.slice(0, 3).map((language, index) => (
                        <Badge key={index} className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs px-2 py-1">
                          {language}
                        </Badge>
                      ))}
                      {profileData.languages.length > 3 && (
                        <Badge className="bg-white/20 text-white border-white/30 text-xs px-2 py-1">
                          +{profileData.languages.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div className="lg:ml-auto">
            <Link href="/provider-dashboard/profile/edit">
              <Button className="bg-white text-[#4A9B9B] hover:bg-white/90 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg">
                <Edit className="h-5 w-5 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}