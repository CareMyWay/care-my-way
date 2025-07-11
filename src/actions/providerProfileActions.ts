import { generateClient } from "aws-amplify/data";
import { getCurrentUser } from "aws-amplify/auth";
import type { Schema } from "../../amplify/data/resource";

// Generate client for client-side usage
const client = generateClient<Schema>();

export interface ProviderProfileData {
    id?: string;
    userId: string;
    profileOwner: string;

    // Personal & Contact Information
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    languages?: string[];
    phone?: string;
    email?: string;
    preferredContact?: string;
    profilePhoto?: string;

    // Address Information
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;

    // Emergency Contact
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;

    // Professional Summary
    profileTitle?: string;
    bio?: string;
    yearsExperience?: string;
    askingRate?: string;
    rateType?: string;
    responseTime?: string;
    servicesOffered?: string[];

    // Credentials & Work History (stored as JSON)
    education?: any;
    certifications?: any;
    workExperience?: any;

    // Profile completion status
    isProfileComplete?: boolean;
    isPubliclyVisible?: boolean;

    // Timestamps (managed by Amplify)
    createdAt?: string;
    updatedAt?: string;
}

// Get existing provider profile by userId
export const getProviderProfile = async (userId: string): Promise<ProviderProfileData | null> => {
    console.log("Getting ProviderProfile for userId:", userId);

    try {
        // Check if user is authenticated
        await getCurrentUser();

        const { data, errors } = await client.models.ProviderProfile.list({
            filter: { userId: { eq: userId } }
        });

        if (errors) {
            console.error("Error fetching ProviderProfile:", errors);
            return null;
        }

        if (data && data.length > 0) {
            console.log("Found existing ProviderProfile:", data[0]);
            return data[0] as ProviderProfileData;
        }

        console.log("No ProviderProfile found for userId:", userId);
        return null;
    } catch (error) {
        console.error("Error in getProviderProfile:", error);
        return null;
    }
};

// Create new provider profile
export const createProviderProfile = async (
    profileData: Omit<ProviderProfileData, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ProviderProfileData | null> => {
    console.log("Creating ProviderProfile", profileData);

    try {
        // Check if user is authenticated
        await getCurrentUser();

        const { data, errors } = await client.models.ProviderProfile.create({
            userId: profileData.userId,
            profileOwner: profileData.profileOwner,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            dob: profileData.dob,
            gender: profileData.gender,
            languages: profileData.languages,
            phone: profileData.phone,
            email: profileData.email,
            preferredContact: profileData.preferredContact,
            profilePhoto: profileData.profilePhoto,
            address: profileData.address,
            city: profileData.city,
            province: profileData.province,
            postalCode: profileData.postalCode,
            emergencyContactName: profileData.emergencyContactName,
            emergencyContactPhone: profileData.emergencyContactPhone,
            emergencyContactRelationship: profileData.emergencyContactRelationship,
            profileTitle: profileData.profileTitle,
            bio: profileData.bio,
            yearsExperience: profileData.yearsExperience,
            askingRate: profileData.askingRate,
            rateType: profileData.rateType,
            responseTime: profileData.responseTime,
            servicesOffered: profileData.servicesOffered,
            education: profileData.education,
            certifications: profileData.certifications,
            workExperience: profileData.workExperience,
            isProfileComplete: profileData.isProfileComplete,
            isPubliclyVisible: profileData.isPubliclyVisible,
        });

        if (errors) {
            console.error("Error creating ProviderProfile:", errors);
            return null;
        }

        console.log("ProviderProfile created successfully:", data);
        return data as ProviderProfileData;
    } catch (error) {
        console.error("Error in createProviderProfile:", error);
        return null;
    }
};

// Update existing provider profile
export const updateProviderProfile = async (
    id: string,
    profileData: Partial<ProviderProfileData>
): Promise<ProviderProfileData | null> => {
    console.log("Updating ProviderProfile", id, profileData);

    try {
        // Check if user is authenticated
        await getCurrentUser();

        const updateInput: any = { id };

        // Only add fields that are defined to avoid overwriting with undefined
        if (profileData.firstName !== undefined) updateInput.firstName = profileData.firstName;
        if (profileData.lastName !== undefined) updateInput.lastName = profileData.lastName;
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
        if (profileData.yearsExperience !== undefined) updateInput.yearsExperience = profileData.yearsExperience;
        if (profileData.askingRate !== undefined) updateInput.askingRate = profileData.askingRate;
        if (profileData.rateType !== undefined) updateInput.rateType = profileData.rateType;
        if (profileData.responseTime !== undefined) updateInput.responseTime = profileData.responseTime;
        if (profileData.servicesOffered !== undefined) updateInput.servicesOffered = profileData.servicesOffered;
        if (profileData.education !== undefined) updateInput.education = profileData.education;
        if (profileData.certifications !== undefined) updateInput.certifications = profileData.certifications;
        if (profileData.workExperience !== undefined) updateInput.workExperience = profileData.workExperience;
        if (profileData.isProfileComplete !== undefined) updateInput.isProfileComplete = profileData.isProfileComplete;
        if (profileData.isPubliclyVisible !== undefined) updateInput.isPubliclyVisible = profileData.isPubliclyVisible;

        const { data, errors } = await client.models.ProviderProfile.update(updateInput);

        if (errors) {
            console.error("Error updating ProviderProfile:", errors);
            return null;
        }

        console.log("ProviderProfile updated successfully:", data);
        return data as ProviderProfileData;
    } catch (error) {
        console.error("Error in updateProviderProfile:", error);
        return null;
    }
};

// Transform form data to profile format
export const transformFormDataToProfile = (
    formData: any,
    userId: string,
    profileOwner: string
): Omit<ProviderProfileData, 'id' | 'createdAt' | 'updatedAt'> => {
    return {
        userId,
        profileOwner,

        // Personal & Contact Information
        firstName: formData["personal-contact"]?.firstName,
        lastName: formData["personal-contact"]?.lastName,
        dob: formData["personal-contact"]?.dob,
        gender: formData["personal-contact"]?.gender,
        languages: formData["personal-contact"]?.languages,
        phone: formData["personal-contact"]?.phone,
        email: formData["personal-contact"]?.email,
        preferredContact: formData["personal-contact"]?.preferredContact,
        profilePhoto: formData["personal-contact"]?.profilePhoto,

        // Address Information
        address: formData.address?.address,
        city: formData.address?.city,
        province: formData.address?.province,
        postalCode: formData.address?.postalCode,

        // Emergency Contact
        emergencyContactName: formData["emergency-contact"]?.contactName,
        emergencyContactPhone: formData["emergency-contact"]?.contactPhone,
        emergencyContactRelationship: formData["emergency-contact"]?.relationship,

        // Professional Summary
        profileTitle: formData["professional-summary"]?.profileTitle,
        bio: formData["professional-summary"]?.bio,
        yearsExperience: formData["professional-summary"]?.yearsExperience,
        askingRate: formData["professional-summary"]?.askingRate,
        rateType: formData["professional-summary"]?.rateType,
        responseTime: formData["professional-summary"]?.responseTime,
        servicesOffered: formData["professional-summary"]?.servicesOffered,

        // Credentials & Work History
        education: formData.credentials?.education,
        certifications: formData.credentials?.certifications,
        workExperience: formData.credentials?.workExperience,

        // Profile completion status
        isProfileComplete: true,
        isPubliclyVisible: true,
    };
}; 