"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, User, Upload, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type ProviderProfileData } from "@/actions/providerProfileActions";
import { uploadProfilePhoto, deleteFile, getFileUrl, extractS3Key } from "@/utils/s3-upload";
import { getCurrentUser } from "aws-amplify/auth";
import toast from "react-hot-toast";

interface EditProfileHeaderProps {
    profileData: Partial<ProviderProfileData>;
    // eslint-disable-next-line no-unused-vars
    onUpdate: (updates: Partial<ProviderProfileData>) => void;
}

export function EditProfileHeader({ profileData, onUpdate }: EditProfileHeaderProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("/placeholder.svg?height=128&width=128");
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helper function to get initials
    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName && !lastName) return "P";
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
    };

    // Load existing profile photo from S3 if it exists
    useEffect(() => {
        const loadProfilePhoto = async () => {
            if (!profileData.profilePhoto) {
                setProfilePhotoUrl("/placeholder.svg?height=128&width=128");
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
                    setProfilePhotoUrl("/placeholder.svg?height=128&width=128");
                }
            } catch (error) {
                console.error('Error loading profile photo:', error);
                setProfilePhotoUrl("/placeholder.svg?height=128&width=128");
            } finally {
                setIsLoadingPhoto(false);
            }
        };

        loadProfilePhoto();
    }, [profileData.profilePhoto]);

    // Handle profile photo upload
    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast.error('Image must be smaller than 5MB');
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
            if (profileData.profilePhoto && !profileData.profilePhoto.startsWith('http')) {
                try {
                    await deleteFile(profileData.profilePhoto);
                    console.log('✅ Old profile photo deleted from S3');
                } catch (error) {
                    console.warn('⚠️ Could not delete old profile photo:', error);
                    // Continue anyway - don't block the upload
                }
            }

            // Upload new photo to S3
            const result = await uploadProfilePhoto(file);
            if (result?.key) {
                // Update the form data with the new S3 key
                onUpdate({ profilePhoto: result.key });

                // Update the preview with the new signed URL
                const newSignedUrl = await getFileUrl(result.key, 3600);
                if (newSignedUrl) {
                    setProfilePhotoUrl(newSignedUrl);
                }

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

    return (
        <Card className="border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 p-0">
            <CardHeader className="bg-gradient-to-r from-[#4A9B9B] via-[#5CAB9B] to-[#6CBB9B] text-white px-6 py-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-white/20 rounded-xl">
                        <User className="h-6 w-6 text-white" />
                    </div>
                    Profile Photo & Display
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                />

                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-[#4A9B9B]/20 shadow-lg ring-4 ring-[#4A9B9B]/10">
                                <AvatarImage
                                    src={profilePhotoUrl}
                                    alt={`${profileData.firstName} ${profileData.lastName}`}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-[#4A9B9B]/10 text-[#4A9B9B] text-3xl font-bold">
                                    {isLoadingPhoto || isUploading ? (
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    ) : (
                                        getInitials(profileData.firstName, profileData.lastName)
                                    )}
                                </AvatarFallback>
                            </Avatar>
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

                        <div className="text-center">
                            <Button
                                onClick={triggerFileUpload}
                                disabled={isUploading}
                                variant="outline"
                                className="dashboard-button-secondary border-[#4A9B9B] text-[#4A9B9B] hover:bg-[#4A9B9B]/5 disabled:opacity-50"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        {profileData.profilePhoto ? 'Change Photo' : 'Upload Photo'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Profile Title Section */}
                    <div className="flex-1 w-full space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {profileData.firstName && profileData.lastName
                                    ? `${profileData.firstName} ${profileData.lastName}`
                                    : "Your Name"
                                }
                            </h3>
                            <p className="text-lg text-gray-600 mb-6">
                                {profileData.profileTitle || "Healthcare Provider"}
                            </p>
                        </div>

                        {/* Profile Title Input */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Professional Title
                                </label>
                                <input
                                    type="text"
                                    value={profileData.profileTitle || ""}
                                    onChange={(e) => onUpdate({ profileTitle: e.target.value })}
                                    placeholder="e.g., Licensed Physical Therapist, Registered Nurse"
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9B9B] focus:border-[#4A9B9B] transition-colors duration-200 text-lg"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    This appears prominently on your profile and in search results
                                </p>
                            </div>


                        </div>
                    </div>
                </div>

                {/* Photo Upload Guidelines */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Photo Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use a clear, professional headshot</li>
                        <li>• Ensure good lighting and avoid shadows</li>
                        <li>• Recommended size: 400x400 pixels or larger</li>
                        <li>• Accepted formats: JPG, PNG (max 5MB)</li>
                        <li>• Professional attire is recommended</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
} 