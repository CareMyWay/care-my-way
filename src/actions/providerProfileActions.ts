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

// Type for database storage (JSON strings)
export type ProviderProfileDataDB = {
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
    responseTime?: string;
    servicesOffered?: string[];
    education?: string; // JSON string in database
    certifications?: string; // JSON string in database
    workExperience?: string; // JSON string in database
    isProfileComplete?: boolean;
    isPubliclyVisible?: boolean;
};

// Type for UI consumption (parsed arrays)
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
    responseTime?: string;
    servicesOffered?: string[];
    education?: Array<Record<string, unknown>>; // Parsed array for UI
    certifications?: Array<Record<string, unknown>>; // Parsed array for UI
    workExperience?: Array<Record<string, unknown>>; // Parsed array for UI
    isProfileComplete?: boolean;
    isPubliclyVisible?: boolean;
};

// Transform form data to database format
export function transformFormDataToProfile(formData: Record<string, unknown>, userId: string, profileOwner: string): ProviderProfileDataDB {
    // Get form sections with proper typing
    const personalContact = formData["personal-contact"] as Record<string, unknown> || {};
    const address = formData["address"] as Record<string, unknown> || {};
    const emergencyContact = formData["emergency-contact"] as Record<string, unknown> || {};
    const professionalSummary = formData["professional-summary"] as Record<string, unknown> || {};
    const credentials = formData["credentials"] as Record<string, unknown> || {};

    // Combine emergency contact first and last name
    const emergencyContactName = emergencyContact?.contactFirstName && emergencyContact?.contactLastName
        ? `${emergencyContact.contactFirstName} ${emergencyContact.contactLastName}`
        : undefined;

    // Clean up credentials data
    const education = cleanCredentialsData(credentials?.education as Array<Record<string, unknown>>);
    const certifications = cleanCredentialsData(credentials?.certifications as Array<Record<string, unknown>>);
    const workExperience = cleanCredentialsData(credentials?.workExperience as Array<Record<string, unknown>>);

    return {
        userId,
        profileOwner,
        // Personal & Contact Information
        firstName: personalContact?.firstName as string,
        lastName: personalContact?.lastName as string,
        firstNameLower: (personalContact?.firstName as string)?.toLowerCase(),
        lastNameLower: (personalContact?.lastName as string)?.toLowerCase(),
        dob: personalContact?.dob as string,
        gender: personalContact?.gender as string,
        languages: personalContact?.languages as string[] || [],
        phone: personalContact?.phone as string,
        email: personalContact?.email as string,
        preferredContact: personalContact?.preferredContact as string,
        profilePhoto: personalContact?.profilePhoto as string,
        // Address Information
        address: address?.address as string,
        city: address?.city as string,
        province: address?.province as string,
        postalCode: address?.postalCode as string,
        // Emergency Contact
        emergencyContactName,
        emergencyContactPhone: emergencyContact?.contactPhone as string,
        emergencyContactRelationship: emergencyContact?.relationship as string,
        // Professional Summary
        profileTitle: professionalSummary?.profileTitle as string,
        bio: professionalSummary?.bio as string,
        yearsExperience: professionalSummary?.yearsExperience as string,
        yearExperienceFloat: professionalSummary?.yearsExperience
            ? mapExperienceToFloat(professionalSummary.yearsExperience as string)
            : undefined,
        askingRate: professionalSummary?.askingRate
            ? parseFloat(professionalSummary.askingRate as string)
            : undefined,
        responseTime: professionalSummary?.responseTime as string,
        servicesOffered: professionalSummary?.servicesOffered as string[] || [],
        // Credentials (as JSON strings)
        education: education ? JSON.stringify(education) : null,
        certifications: certifications ? JSON.stringify(certifications) : null,
        workExperience: workExperience ? JSON.stringify(workExperience) : null,
        // Profile completion status
        isProfileComplete: false, // Will be set to true when submitting
        isPubliclyVisible: false, // Will be set to true when submitting
    };
}

// Helper function to clean credentials data (remove empty entries)
function cleanCredentialsData(data: Array<Record<string, unknown>> | undefined): Array<Record<string, unknown>> | null {
    if (!data || !Array.isArray(data)) return null;

    const cleaned = data.filter((entry: Record<string, unknown>) => {
        // Remove entries where all main fields are empty
        const hasContent = Object.entries(entry).some(([key, value]) => {
            // Skip documents array for this check
            if (key === "documents") return false;
            return value && typeof value === "string" && value.trim() !== "";
        });

        return hasContent;
    }).map((entry: Record<string, unknown>) => {
        // Remove empty documents arrays
        const cleaned = { ...entry };
        if (cleaned.documents && Array.isArray(cleaned.documents) && cleaned.documents.length === 0) {
            delete cleaned.documents;
        }
        return cleaned;
    });

    return cleaned.length > 0 ? cleaned : null;
}

// Helper function to safely parse JSON strings
function safeParseJSON(value: string | number | boolean | object | Array<unknown> | null | undefined): Array<Record<string, unknown>> | undefined {
    if (!value) return undefined;

    // If it's already an array, return it
    if (Array.isArray(value)) {
        return value as Array<Record<string, unknown>>;
    }

    // If it's not a string, we can't parse it
    if (typeof value !== "string") return undefined;

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : undefined;
    } catch (error) {
        console.warn("Failed to parse JSON:", error);
        return undefined;
    }
}

export async function getProviderProfile(userId: string): Promise<ProviderProfileData | null> {
    try {
        const result = await client.models.ProviderProfile.list({
            filter: { userId: { eq: userId } }
        });

        if (result.errors) {
            console.error("Error fetching provider profile:", result.errors);
            return null;
        }

        const rawProfile = result.data?.[0];
        if (!rawProfile) return null;

        // Transform the raw profile data and parse JSON strings into arrays
        const transformedProfile: ProviderProfileData = {
            ...rawProfile,
            // Parse JSON strings back into arrays for UI consumption
            education: safeParseJSON(rawProfile.education),
            certifications: safeParseJSON(rawProfile.certifications),
            workExperience: safeParseJSON(rawProfile.workExperience),
        } as ProviderProfileData;

        return transformedProfile;
    } catch (error) {
        console.error("Failed to get provider profile:", error);
        return null;
    }
}

export async function updateProviderProfile(profileId: string, profileData: Partial<ProviderProfileDataDB>): Promise<ProviderProfileData | null> {
    try {
        // Build update input object, only including defined fields
        const updateInput: Record<string, unknown> = {
            id: profileId,
        };

        // Only include defined fields to avoid overwriting with undefined
        if (profileData.firstName !== undefined) updateInput.firstName = profileData.firstName;
        if (profileData.lastName !== undefined) updateInput.lastName = profileData.lastName;
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
        if (profileData.yearsExperience !== undefined) updateInput.yearsExperience = profileData.yearsExperience;
        if (profileData.yearExperienceFloat !== undefined) updateInput.yearExperienceFloat = profileData.yearExperienceFloat;
        if (profileData.askingRate !== undefined) updateInput.askingRate = profileData.askingRate;
        if (profileData.responseTime !== undefined) updateInput.responseTime = profileData.responseTime;
        if (profileData.servicesOffered !== undefined) updateInput.servicesOffered = profileData.servicesOffered;
        if (profileData.education !== undefined) updateInput.education = profileData.education;
        if (profileData.certifications !== undefined) updateInput.certifications = profileData.certifications;
        if (profileData.workExperience !== undefined) updateInput.workExperience = profileData.workExperience;
        if (profileData.isProfileComplete !== undefined) updateInput.isProfileComplete = profileData.isProfileComplete;
        if (profileData.isPubliclyVisible !== undefined) updateInput.isPubliclyVisible = profileData.isPubliclyVisible;

        // Cast to the required input type for the Amplify client
        const result = await client.models.ProviderProfile.update(updateInput as Parameters<typeof client.models.ProviderProfile.update>[0]);

        if (result.errors) {
            console.error("Error updating provider profile:", result.errors);
            return null;
        }

        // Transform the result to parse JSON strings back into arrays
        const rawUpdatedProfile = result.data;
        if (!rawUpdatedProfile) return null;

        const transformedProfile: ProviderProfileData = {
            ...rawUpdatedProfile,
            // Parse JSON strings back into arrays for UI consumption
            education: safeParseJSON(rawUpdatedProfile.education),
            certifications: safeParseJSON(rawUpdatedProfile.certifications),
            workExperience: safeParseJSON(rawUpdatedProfile.workExperience),
        } as ProviderProfileData;

        return transformedProfile;
    } catch (error) {
        console.error("Failed to update provider profile:", error);
        return null;
    }
} 