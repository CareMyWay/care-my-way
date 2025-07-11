export interface HealthcareService {
    id: string;
    name: string;
    category: string;
    description?: string;
}

export const healthcareServiceCategories = {
    PERSONAL_CARE: "Personal Care",
    MEDICAL_CARE: "Medical Care",
    COMPANION_CARE: "Companion Care",
    SPECIALIZED_CARE: "Specialized Care",
    SUPPORT_SERVICES: "Support Services"
} as const;

export const healthcareServices: HealthcareService[] = [
    // Personal Care
    {
        id: "personal-care-assistance",
        name: "Personal Care Assistance",
        category: healthcareServiceCategories.PERSONAL_CARE,
        description: "Help with daily activities like bathing, dressing, grooming"
    },
    {
        id: "meal-preparation",
        name: "Meal Preparation",
        category: healthcareServiceCategories.PERSONAL_CARE,
        description: "Planning, cooking, and serving nutritious meals"
    },
    {
        id: "light-housekeeping",
        name: "Light Housekeeping",
        category: healthcareServiceCategories.PERSONAL_CARE,
        description: "Basic cleaning, laundry, and home maintenance"
    },
    {
        id: "mobility-assistance",
        name: "Mobility Assistance",
        category: healthcareServiceCategories.PERSONAL_CARE,
        description: "Help with walking, transfers, and movement"
    },

    // Medical Care
    {
        id: "medication-management",
        name: "Medication Management",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Medication reminders, organization, and administration"
    },
    {
        id: "wound-care",
        name: "Wound Care",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Professional wound cleaning, dressing, and monitoring"
    },
    {
        id: "iv-therapy",
        name: "IV Therapy",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Intravenous medication and fluid administration"
    },
    {
        id: "catheter-care",
        name: "Catheter Care",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Catheter maintenance and monitoring"
    },
    {
        id: "blood-pressure-monitoring",
        name: "Blood Pressure Monitoring",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Regular blood pressure checks and documentation"
    },
    {
        id: "diabetes-management",
        name: "Diabetes Management",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Blood sugar monitoring and diabetes care support"
    },
    {
        id: "chronic-disease-management",
        name: "Chronic Disease Management",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Ongoing care for chronic health conditions"
    },
    {
        id: "post-surgery-recovery",
        name: "Post-Surgery Recovery",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Recovery support after surgical procedures"
    },
    {
        id: "physical-therapy-assistance",
        name: "Physical Therapy Assistance",
        category: healthcareServiceCategories.MEDICAL_CARE,
        description: "Support with prescribed physical therapy exercises"
    },

    // Companion Care
    {
        id: "companion-care",
        name: "Companion Care",
        category: healthcareServiceCategories.COMPANION_CARE,
        description: "Social interaction and emotional support"
    },
    {
        id: "transportation-appointments",
        name: "Transportation to Appointments",
        category: healthcareServiceCategories.COMPANION_CARE,
        description: "Safe transport to medical and personal appointments"
    },
    {
        id: "respite-care",
        name: "Respite Care",
        category: healthcareServiceCategories.COMPANION_CARE,
        description: "Temporary relief care for family caregivers"
    },
    {
        id: "mental-health-support",
        name: "Mental Health Support",
        category: healthcareServiceCategories.COMPANION_CARE,
        description: "Emotional and psychological support services"
    },

    // Specialized Care
    {
        id: "dementia-alzheimers-care",
        name: "Dementia & Alzheimer's Care",
        category: healthcareServiceCategories.SPECIALIZED_CARE,
        description: "Specialized care for memory-related conditions"
    },
    {
        id: "palliative-care",
        name: "Palliative Care",
        category: healthcareServiceCategories.SPECIALIZED_CARE,
        description: "Comfort care for serious illness management"
    },
    {
        id: "fall-prevention",
        name: "Fall Prevention",
        category: healthcareServiceCategories.SPECIALIZED_CARE,
        description: "Safety assessments and fall risk reduction"
    },

    // Support Services
    {
        id: "emergency-response",
        name: "Emergency Response",
        category: healthcareServiceCategories.SUPPORT_SERVICES,
        description: "24/7 emergency support and response services"
    },
    {
        id: "other",
        name: "Other",
        category: healthcareServiceCategories.SUPPORT_SERVICES,
        description: "Additional services not listed above"
    }
];

// Helper functions
export const getServicesByCategory = (category: string): HealthcareService[] => {
    return healthcareServices.filter(service => service.category === category);
};

export const getServiceNames = (): string[] => {
    return healthcareServices.map(service => service.name);
};

export const getServiceById = (id: string): HealthcareService | undefined => {
    return healthcareServices.find(service => service.id === id);
};

export const searchServices = (searchTerm: string): HealthcareService[] => {
    const term = searchTerm.toLowerCase();
    return healthcareServices.filter(service =>
        service.name.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term) ||
        service.category.toLowerCase().includes(term)
    );
};

// Export just the service names for backward compatibility
export const healthcareServiceNames = getServiceNames(); 