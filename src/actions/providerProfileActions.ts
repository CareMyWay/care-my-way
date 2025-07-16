import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

// Experience mapping for filtering
export function mapExperienceToFloat(yearsExperience: string): number {
    const mapping: { [key: string]: number } = {
        "Less than 1 year": 0.5,
        "1-2 years": 1.5,
        "3-5 years": 3.5,
        "5+ years": 5.5,
    };

    return mapping[yearsExperience] || 0;
}

export type ProviderProfileData = {
    id?: string;
    userId: string;
    profileOwner: string;
    firstName?: string;
    lastName?: string;
    // Lowercase versions for case-insensitive search
    firstNameLower?: string;
    lastNameLower?: string;
    dob?: string;
    gender?: string;
    languages?: string[];
    phone?: string;
    email?: string;
    preferredContact?: string;
    profilePhoto?: string;
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    profileTitle?: string;
    bio?: string;
    yearsExperience?: string;
    // Numeric representation for filtering and sorting
    yearExperienceFloat?: number;
    askingRate?: number;
    rateType?: string;
    responseTime?: string;
    servicesOffered?: string[];
    education?: any[];
    certifications?: any[];
    workExperience?: any[];
    isProfileComplete?: boolean;
    isPubliclyVisible?: boolean;
};

// Get provider profile by userId
export async function getProviderProfile(userId: string): Promise<ProviderProfileData | null> {
    try {
        console.log("getProviderProfile called for userId:", userId);

        const response = await client.models.ProviderProfile.list({
            filter: { userId: { eq: userId } }
        });

        if (response.errors) {
            console.error("Error fetching provider profile:", response.errors);
            throw new Error("Failed to fetch provider profile");
        }

        if (response.data && response.data.length > 0) {
            const rawProfile = response.data[0];
            console.log("Raw profile data:", rawProfile);

            // Transform the raw profile data to match our expected format
            const profile: ProviderProfileData = {
                ...(rawProfile as any),
                // Parse JSON fields if they exist and are strings
                education: rawProfile.education ? (
                    typeof rawProfile.education === 'string'
                        ? JSON.parse(rawProfile.education)
                        : rawProfile.education
                ) : [],
                certifications: rawProfile.certifications ? (
                    typeof rawProfile.certifications === 'string'
                        ? JSON.parse(rawProfile.certifications)
                        : rawProfile.certifications
                ) : [],
                workExperience: rawProfile.workExperience ? (
                    typeof rawProfile.workExperience === 'string'
                        ? JSON.parse(rawProfile.workExperience)
                        : rawProfile.workExperience
                ) : [],
                // Ensure arrays are properly handled
                languages: rawProfile.languages || [],
                servicesOffered: rawProfile.servicesOffered || [],
            };

            console.log("Transformed profile data:", profile);
            return profile;
        }

        console.log("No profile found for userId:", userId);
        return null;
    } catch (error) {
        console.error("Error in getProviderProfile:", error);
        throw error;
    }
}

// Update provider profile
export async function updateProviderProfile(profileId: string, profileData: Partial<ProviderProfileData>): Promise<ProviderProfileData | null> {
    try {
        console.log("updateProviderProfile called with:", { profileId, profileData });

        // Build update object with proper types
        const updateInput: any = {
            id: profileId,
        };

        // Only include defined fields to avoid overwriting with undefined
        if (profileData.firstName !== undefined) {
            updateInput.firstName = profileData.firstName;
            // Auto-calculate lowercase version
            updateInput.firstNameLower = profileData.firstName?.toLowerCase();
        }
        if (profileData.lastName !== undefined) {
            updateInput.lastName = profileData.lastName;
            // Auto-calculate lowercase version
            updateInput.lastNameLower = profileData.lastName?.toLowerCase();
        }
        if (profileData.firstNameLower !== undefined) updateInput.firstNameLower = profileData.firstNameLower;
        if (profileData.lastNameLower !== undefined) updateInput.lastNameLower = profileData.lastNameLower;
        if (profileData.dob !== undefined) updateInput.dob = profileData.dob;
        if (profileData.gender !== undefined) updateInput.gender = profileData.gender;
        if (profileData.languages !== undefined) updateInput.languages = profileData.languages;
        if (profileData.phone !== undefined) updateInput.phone = profileData.phone;
        if (profileData.email !== undefined) updateInput.email = profileData.email;
        if (profileData.preferredContact !== undefined) updateInput.preferredContact = profileData.preferredContact;
        if (profileData.profilePhoto !== undefined) updateInput.profilePhoto = profileData.profilePhoto;
        if (profileData.address !== undefined) updateInput.address = profileData.address;
        if (profileData.city !== undefined) updateInput.city = profileData.city;
        if (profileData.province !== undefined) updateInput.province = profileData.province;
        if (profileData.postalCode !== undefined) updateInput.postalCode = profileData.postalCode;
        if (profileData.emergencyContactName !== undefined) updateInput.emergencyContactName = profileData.emergencyContactName;
        if (profileData.emergencyContactPhone !== undefined) updateInput.emergencyContactPhone = profileData.emergencyContactPhone;
        if (profileData.emergencyContactRelationship !== undefined) updateInput.emergencyContactRelationship = profileData.emergencyContactRelationship;
        if (profileData.profileTitle !== undefined) updateInput.profileTitle = profileData.profileTitle;
        if (profileData.bio !== undefined) updateInput.bio = profileData.bio;
        if (profileData.yearsExperience !== undefined) {
            updateInput.yearsExperience = profileData.yearsExperience;
            // Auto-calculate float version for filtering
            updateInput.yearExperienceFloat = mapExperienceToFloat(profileData.yearsExperience);
        }
        if (profileData.yearExperienceFloat !== undefined) updateInput.yearExperienceFloat = profileData.yearExperienceFloat;
        if (profileData.askingRate !== undefined) updateInput.askingRate = profileData.askingRate;
        if (profileData.rateType !== undefined) updateInput.rateType = profileData.rateType;
        if (profileData.responseTime !== undefined) updateInput.responseTime = profileData.responseTime;
        if (profileData.servicesOffered !== undefined) updateInput.servicesOffered = profileData.servicesOffered;

        // Handle JSON fields - stringify before sending to GraphQL since schema expects JSON strings
        if (profileData.education !== undefined) {
            if (profileData.education && profileData.education.length > 0) {
                updateInput.education = JSON.stringify(profileData.education);
                console.log("Setting education:", profileData.education);
            } else {
                console.log("Education is empty, setting to null");
                updateInput.education = null;
            }
        }
        if (profileData.certifications !== undefined) {
            if (profileData.certifications && profileData.certifications.length > 0) {
                updateInput.certifications = JSON.stringify(profileData.certifications);
                console.log("Setting certifications:", profileData.certifications);
            } else {
                console.log("Certifications is empty, setting to null");
                updateInput.certifications = null;
            }
        }
        if (profileData.workExperience !== undefined) {
            if (profileData.workExperience && profileData.workExperience.length > 0) {
                updateInput.workExperience = JSON.stringify(profileData.workExperience);
                console.log("Setting workExperience:", profileData.workExperience);
            } else {
                console.log("WorkExperience is empty, setting to null");
                updateInput.workExperience = null;
            }
        }

        if (profileData.isProfileComplete !== undefined) updateInput.isProfileComplete = profileData.isProfileComplete;
        if (profileData.isPubliclyVisible !== undefined) updateInput.isPubliclyVisible = profileData.isPubliclyVisible;

        console.log("Final update input:", JSON.stringify(updateInput, null, 2));

        const response = await client.models.ProviderProfile.update(updateInput);

        if (response.errors) {
            console.error("GraphQL errors in updateProviderProfile:", JSON.stringify(response.errors, null, 2));
            throw new Error(`GraphQL errors: ${JSON.stringify(response.errors)}`);
        }

        console.log("ProviderProfile updated successfully:", response.data);
        return response.data as unknown as ProviderProfileData;
    } catch (error) {
        console.error("Error in updateProviderProfile:", error);
        throw error;
    }
}

// Clean up credentials data by removing empty documents arrays
function cleanCredentialsData(credentialsArray: any[]) {
    if (!credentialsArray || credentialsArray.length === 0) {
        return null;
    }

    return credentialsArray.map(item => {
        const cleanedItem = { ...item };

        // Remove documents field if it's empty or undefined
        if (!cleanedItem.documents || cleanedItem.documents.length === 0) {
            delete cleanedItem.documents;
        }

        return cleanedItem;
    });
}

// Transform form data to database format
export function transformFormDataToProfile(formData: any, userId: string, profileOwner: string) {
    // Combine emergency contact first and last name
    const emergencyContactName = formData['emergency-contact']?.contactFirstName && formData['emergency-contact']?.contactLastName
        ? `${formData['emergency-contact'].contactFirstName} ${formData['emergency-contact'].contactLastName}`
        : undefined;

    // Clean up credentials data
    const education = cleanCredentialsData(formData.credentials?.education);
    const certifications = cleanCredentialsData(formData.credentials?.certifications);
    const workExperience = cleanCredentialsData(formData.credentials?.workExperience);

    // Calculate derived fields for marketplace filtering
    const firstName = formData['personal-contact']?.firstName;
    const lastName = formData['personal-contact']?.lastName;
    const yearsExperience = formData['professional-summary']?.yearsExperience;
    const askingRateStr = formData['professional-summary']?.askingRate;

    return {
        userId,
        profileOwner,
        // Personal & Contact Information
        firstName,
        lastName,
        // Lowercase versions for case-insensitive search
        firstNameLower: firstName?.toLowerCase(),
        lastNameLower: lastName?.toLowerCase(),
        dob: formData['personal-contact']?.dob,
        gender: formData['personal-contact']?.gender,
        languages: formData['personal-contact']?.languages,
        phone: formData['personal-contact']?.phone,
        email: formData['personal-contact']?.email,
        preferredContact: formData['personal-contact']?.preferredContact,
        profilePhoto: formData['personal-contact']?.profilePhoto,

        // Address Information
        address: formData.address?.address,
        city: formData.address?.city,
        province: formData.address?.province,
        postalCode: formData.address?.postalCode,

        // Emergency Contact
        emergencyContactName,
        emergencyContactPhone: formData['emergency-contact']?.contactPhone,
        emergencyContactRelationship: formData['emergency-contact']?.relationship,

        // Professional Summary
        profileTitle: formData['professional-summary']?.profileTitle,
        bio: formData['professional-summary']?.bio,
        yearsExperience,
        // Numeric representation for filtering and sorting
        yearExperienceFloat: yearsExperience ? mapExperienceToFloat(yearsExperience) : undefined,
        askingRate: askingRateStr ? parseFloat(askingRateStr) : undefined,
        rateType: formData['professional-summary']?.rateType,
        responseTime: formData['professional-summary']?.responseTime,
        servicesOffered: formData['professional-summary']?.servicesOffered,

        // Credentials (cleaned)
        education,
        certifications,
        workExperience,

        // Profile completion status
        isProfileComplete: false, // Will be set to true when submitting
        isPubliclyVisible: false, // Will be set to true when submitting
    };
} 