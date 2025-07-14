// Base interface for all form sections
export interface BaseFormSectionProps<T> {
    onDataChange: (data: T) => void;
    isCompleted: boolean;
    defaultValues?: Partial<T>;
}

// Personal & Contact Information
export interface PersonalContactData {
    firstName?: string;
    lastName?: string;
    dob?: string;
    gender?: string;
    languages?: string[];
    phone?: string;
    email?: string;
    preferredContact?: string;
    profilePhoto?: string;
    [key: string]: string | string[] | undefined;
}

// Address Information  
export interface AddressData {
    address?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    [key: string]: string | undefined;
}

// Emergency Contact
export interface EmergencyContactData {
    contactFirstName?: string;
    contactLastName?: string;
    contactPhone?: string;
    relationship?: string;
    [key: string]: string | undefined;
}

// Professional Summary
export interface ProfessionalSummaryData {
    profileTitle?: string;
    bio?: string;
    yearsExperience?: string;
    askingRate?: string;
    rateType?: string;
    responseTime?: string;
    servicesOffered?: string[];
    [key: string]: string | string[] | undefined;
}

// Credentials & Work History
export interface EducationEntry {
    institution?: string;
    degree?: string;
    fieldOfStudy?: string;
    graduationYear?: string;
    documents?: string[];
}

export interface CertificationEntry {
    certificationName?: string;
    issuingOrganization?: string;
    issueDate?: string;
    expiryDate?: string;
    licenseNumber?: string;
    documents?: string[];
}

export interface WorkExperienceEntry {
    employer?: string;
    jobTitle?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    documents?: string[];
}

export interface CredentialsData {
    education?: EducationEntry[];
    certifications?: CertificationEntry[];
    workExperience?: WorkExperienceEntry[];
    [key: string]: EducationEntry[] | CertificationEntry[] | WorkExperienceEntry[] | undefined;
}

// Complete form data structure
export interface CompleteProfileFormData {
    "personal-contact": PersonalContactData;
    address: AddressData;
    "emergency-contact": EmergencyContactData;
    "professional-summary": ProfessionalSummaryData;
    credentials: CredentialsData;
}

// Form section completion tracking
export interface SectionCompletion {
    completed: boolean;
    progress: number;
}

export interface SectionCompletionState {
    "personal-contact": SectionCompletion;
    address: SectionCompletion;
    "emergency-contact": SectionCompletion;
    "professional-summary": SectionCompletion;
    credentials: SectionCompletion;
}

// Section metadata for configuration
export interface FormSectionConfig {
    id: keyof CompleteProfileFormData;
    title: string;
    subtitle: string;
    stepNumber: number;
    component: React.ComponentType<any>;
    requiredFields?: string[];
    isOptional?: boolean;
}

// Union type for all section data
export type SectionData =
    | PersonalContactData
    | AddressData
    | EmergencyContactData
    | ProfessionalSummaryData
    | CredentialsData;

export type SectionKey = keyof CompleteProfileFormData; 