import {
    SectionKey,
    FormSectionConfig
} from "@/types/provider-profile-form";
import { validateRequiredFields, validateOptionalSection, ValidationResult } from "./form-validation";

// Define required fields for each section
export const SECTION_REQUIRED_FIELDS: Record<SectionKey, string[]> = {
    "personal-contact": [
        "firstName",
        "lastName",
        "dob",
        "gender",
        "languages",
        "phone",
        "email",
        "preferredContact",
    ],
    address: [
        "address",
        "city",
        "province",
        "postalCode"
    ],
    "emergency-contact": [
        "contactFirstName",
        "contactLastName",
        "contactPhone",
        "relationship"
    ],
    "professional-summary": [
        "profileTitle",
        "bio",
        "yearsExperience",
        "askingRate",
        "rateType",
        "responseTime",
        "servicesOffered",
    ],
    credentials: [] // Optional section
};

// Section configuration
export const FORM_SECTIONS: FormSectionConfig[] = [
    {
        id: "personal-contact",
        title: "Personal & Contact Information",
        subtitle: "Please provide your personal details and contact preferences",
        stepNumber: 1,
        component: {} as React.ComponentType<unknown>, // Will be set at runtime
        requiredFields: SECTION_REQUIRED_FIELDS["personal-contact"],
    },
    {
        id: "address",
        title: "Address Information",
        subtitle: "Please provide your residential address details",
        stepNumber: 2,
        component: {} as React.ComponentType<unknown>,
        requiredFields: SECTION_REQUIRED_FIELDS.address,
    },
    {
        id: "emergency-contact",
        title: "Emergency Contact",
        subtitle: "Please provide details for someone to contact in case of emergency",
        stepNumber: 3,
        component: {} as React.ComponentType<unknown>,
        requiredFields: SECTION_REQUIRED_FIELDS["emergency-contact"],
    },
    {
        id: "professional-summary",
        title: "Professional Summary",
        subtitle: "Showcase your expertise, experience, and services offered",
        stepNumber: 4,
        component: {} as React.ComponentType<unknown>,
        requiredFields: SECTION_REQUIRED_FIELDS["professional-summary"],
    },
    {
        id: "credentials",
        title: "Credentials & Work History",
        subtitle: "Optional: Add your education, certifications, and work experience to build client trust",
        stepNumber: 5,
        component: {} as React.ComponentType<unknown>,
        isOptional: true,
    }
];

// Validation function factory
export function createSectionValidator(sectionKey: SectionKey) {
    return (sectionData: Record<string, unknown>, visitedSections?: Set<string>): ValidationResult => {
        // Handle optional credentials section
        if (sectionKey === "credentials") {
            const hasVisited = visitedSections?.has("credentials") ?? false;
            return validateOptionalSection(hasVisited, sectionData);
        }

        // Handle regular required sections
        const requiredFields = SECTION_REQUIRED_FIELDS[sectionKey];
        return validateRequiredFields(sectionData, requiredFields);
    };
}

// Get all section validators
export const SECTION_VALIDATORS = Object.keys(SECTION_REQUIRED_FIELDS).reduce(
    (validators, sectionKey) => {
        validators[sectionKey as SectionKey] = createSectionValidator(sectionKey as SectionKey);
        return validators;
    },
    {} as Record<SectionKey, (sectionData: Record<string, unknown>, visitedSections?: Set<string>) => ValidationResult>
); 