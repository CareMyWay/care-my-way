"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFileUrl } from "@/utils/s3-upload";

interface ProfilePhotoDisplayProps {
    /** S3 key or URL of the profile photo */
    profilePhoto?: string;
    /** First name for initials fallback */
    firstName?: string;
    /** Last name for initials fallback */
    lastName?: string;
    /** Size class for the avatar (default: "h-32 w-32") */
    size?: string;
    /** Additional CSS classes */
    className?: string;
    /** Alt text for the image */
    alt?: string;
    /** Whether to show loading spinner */
    showLoading?: boolean;
}

export function ProfilePhotoDisplay({
    profilePhoto,
    firstName,
    lastName,
    size = "h-32 w-32",
    className = "",
    alt,
    showLoading = true
}: ProfilePhotoDisplayProps) {
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("/placeholder.svg?height=128&width=128");
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

    // Helper function to get initials
    const getInitials = (first?: string, last?: string) => {
        if (!first && !last) return "P";
        return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
    };

    // Load profile photo from S3 if it's an S3 key
    useEffect(() => {
        const loadProfilePhoto = async () => {
            if (!profilePhoto) {
                setProfilePhotoUrl("/placeholder.svg?height=128&width=128");
                return;
            }

            // Check if it's already a full URL (starts with http)
            if (profilePhoto.startsWith('http')) {
                setProfilePhotoUrl(profilePhoto);
                return;
            }

            // Assume it's an S3 key, get signed URL
            try {
                if (showLoading) setIsLoadingPhoto(true);
                const signedUrl = await getFileUrl(profilePhoto, 3600); // 1 hour expiry
                if (signedUrl) {
                    setProfilePhotoUrl(signedUrl);
                } else {
                    setProfilePhotoUrl("/placeholder.svg?height=128&width=128");
                }
            } catch (error) {
                console.error('Error loading profile photo:', error);
                setProfilePhotoUrl("/placeholder.svg?height=128&width=128");
            } finally {
                if (showLoading) setIsLoadingPhoto(false);
            }
        };

        loadProfilePhoto();
    }, [profilePhoto, showLoading]);

    return (
        <Avatar className={`${size} ${className}`}>
            <AvatarImage
                src={profilePhotoUrl}
                alt={alt || `${firstName} ${lastName}`}
                className="object-cover"
            />
            <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-bold">
                {isLoadingPhoto && showLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-600"></div>
                ) : (
                    getInitials(firstName, lastName)
                )}
            </AvatarFallback>
        </Avatar>
    );
}