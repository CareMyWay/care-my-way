"use client";

import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { getFileUrl } from "@/utils/s3-upload";
import Image from "next/image";

interface UserProfilePictureProps {
    profilePhoto?: string;
    firstName?: string;
    lastName?: string;
    size?: "sm" | "md" | "lg";
}

const UserProfilePicture: React.FC<UserProfilePictureProps> = ({
    profilePhoto,
    firstName,
    lastName,
    size = "md",
}) => {
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

    // Size configurations
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    // Helper function to get initials
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "U";
        const first = firstName?.[0] || "";
        const last = lastName?.[0] || "";
        return `${first}${last}`.toUpperCase();
    };

    // Load profile photo
    useEffect(() => {
        const loadProfilePhoto = async () => {
            if (!profilePhoto) {
                setProfilePhotoUrl(null);
                return;
            }

            // Check if it's already a full URL (starts with http or data:)
            if (profilePhoto.startsWith("http") || profilePhoto.startsWith("data:")) {
                setProfilePhotoUrl(profilePhoto);
                return;
            }

            // Assume it's an S3 key, get signed URL
            try {
                setIsLoadingPhoto(true);
                const signedUrl = await getFileUrl(profilePhoto, 3600); // 1 hour expiry
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
    }, [profilePhoto]);

    return (
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0`}>
            {isLoadingPhoto ? (
                <div className="w-full h-full bg-light-green flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-medium-green border-t-transparent"></div>
                </div>
            ) : profilePhotoUrl ? (
                <Image
                    src={profilePhotoUrl}
                    alt={`${firstName || ""} ${lastName || ""}`.trim() || "Profile"}
                    width={size === "sm" ? 32 : size === "md" ? 40 : 48}
                    height={size === "sm" ? 32 : size === "md" ? 40 : 48}
                    className="w-full h-full object-cover"
                    onError={() => setProfilePhotoUrl(null)}
                />
            ) : (
                <div className="w-full h-full bg-medium-green flex items-center justify-center">
                    {firstName || lastName ? (
                        <span className="text-white text-sm font-medium">
                            {getInitials(firstName, lastName)}
                        </span>
                    ) : (
                        <User className="text-white" size={iconSizes[size]} />
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfilePicture;
