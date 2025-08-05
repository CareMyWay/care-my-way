"use client";

import { useState, useRef } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadProfilePhoto, deleteFile, getFileUrl } from "@/utils/s3-upload";
import { getCurrentUser } from "aws-amplify/auth";
import toast from "react-hot-toast";
import { ProfilePhotoDisplay } from "./profile-photo-display";

interface ProfilePhotoUploadProps {
    /** Current profile photo S3 key or URL */
    profilePhoto?: string;
    /** First name for initials fallback */
    firstName?: string;
    /** Last name for initials fallback */
    lastName?: string;
    /** Callback when photo is uploaded successfully */
    // eslint-disable-next-line no-unused-vars
    onPhotoUploaded?: (s3Key: string, signedUrl: string) => void;
    /** Size class for the avatar (default: "h-32 w-32") */
    size?: string;
    /** Additional CSS classes for the container */
    className?: string;
    /** Whether to show upload guidelines */
    showGuidelines?: boolean;
    /** File size limit in MB (default: 5) */
    maxSizeMB?: number;
    /** Whether to show the change/upload button text */
    showButtonText?: boolean;
    /** Custom button variant */
    buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

export function ProfilePhotoUpload({
    profilePhoto,
    firstName,
    lastName,
    onPhotoUploaded,
    size = "h-32 w-32",
    className = "",
    showGuidelines = true,
    maxSizeMB = 5,
    showButtonText = true,
    buttonVariant = "outline"
}: ProfilePhotoUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [localPhotoUrl, setLocalPhotoUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle profile photo upload
    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            toast.error(`Image must be smaller than ${maxSizeMB}MB`);
            return;
        }

        try {
            setIsUploading(true);

            // Get current user
            const user = await getCurrentUser();
            if (!user?.userId) {
                toast.error('User not found');
                return;
            }

            // Delete old profile photo if it exists and is an S3 key
            if (profilePhoto && !profilePhoto.startsWith('http')) {
                try {
                    await deleteFile(profilePhoto);
                    console.log('✅ Old profile photo deleted from S3');
                } catch (error) {
                    console.warn('⚠️ Could not delete old profile photo:', error);
                    // Continue anyway - don't block the upload
                }
            }

            // Upload new photo to S3
            const result = await uploadProfilePhoto(file);
            if (result?.key) {
                // Get signed URL for immediate preview
                const signedUrl = await getFileUrl(result.key, 3600);
                if (signedUrl) {
                    setLocalPhotoUrl(signedUrl);
                }

                // Call the callback with the new S3 key and signed URL
                onPhotoUploaded?.(result.key, signedUrl || '');

                toast.success('Profile photo updated successfully!');
            } else {
                throw new Error('Upload failed - no key returned');
            }
        } catch (error) {
            console.error('Error uploading profile photo:', error);
            toast.error('Failed to upload photo. Please try again.');
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    // Trigger file input
    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    // Use local photo URL if available, otherwise use the prop
    const displayPhoto = localPhotoUrl || profilePhoto;

    return (
        <div className={`flex flex-col items-center space-y-4 ${className}`}>
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
            />

            {/* Profile Photo Display */}
            <div className="relative">
                <ProfilePhotoDisplay
                    profilePhoto={displayPhoto}
                    firstName={firstName}
                    lastName={lastName}
                    size={size}
                    className="border-4 border-gray-200 shadow-lg ring-4 ring-gray-100"
                    showLoading={false}
                />

                {/* Camera Button Overlay */}
                <Button
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    size="sm"
                    className="absolute -bottom-2 -right-2 bg-[#4A9B9B] hover:bg-[#4A9B9B]/90 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Camera className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Upload Button */}
            {showButtonText && (
                <Button
                    onClick={triggerFileUpload}
                    disabled={isUploading}
                    variant={buttonVariant}
                    className="border-[#4A9B9B] text-[#4A9B9B] hover:bg-[#4A9B9B]/5 disabled:opacity-50"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 mr-2" />
                            {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                        </>
                    )}
                </Button>
            )}

            {/* Guidelines */}
            {showGuidelines && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 w-full max-w-md">
                    <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use a clear, professional headshot</li>
                        <li>• Ensure good lighting and avoid shadows</li>
                        <li>• Recommended size: 400x400 pixels or larger</li>
                        <li>• Accepted formats: JPG, PNG (max {maxSizeMB}MB)</li>
                        <li>• Professional attire is recommended</li>
                    </ul>
                </div>
            )}
        </div>
    );
}