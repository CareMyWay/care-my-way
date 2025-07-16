export interface ValidationResult {
    progress: number;
    completed: boolean;
}

export function validateRequiredFields<T extends Record<string, unknown>>(
    data: T,
    requiredFields: (keyof T)[]
): ValidationResult {
    const filled = requiredFields.filter((field) => {
        const value = data[field];

        // Handle array fields (like languages, servicesOffered)
        if (Array.isArray(value)) {
            return value.length > 0;
        }

        // Handle string fields
        if (typeof value === "string") {
            return value.trim() !== "";
        }

        // Handle other truthy values
        return Boolean(value);
    });

    return {
        progress: (filled.length / requiredFields.length) * 100,
        completed: filled.length === requiredFields.length,
    };
}

export function validateOptionalSection(
    hasVisited: boolean,
    data?: Record<string, unknown>
): ValidationResult {
    if (!hasVisited) {
        return {
            progress: 0,
            completed: false,
        };
    }

    // For optional sections, once visited they're considered complete
    // But we can still calculate progress based on content
    if (!data) {
        return {
            progress: 100,
            completed: true,
        };
    }

    // Calculate progress for optional sections with nested data
    let totalFields = 0;
    let filledFields = 0;

    Object.values(data).forEach((value) => {
        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (typeof item === "object" && item !== null) {
                    Object.entries(item).forEach(([, fieldValue]) => {
                        totalFields++;
                        if (fieldValue && fieldValue.toString().trim() !== "") {
                            filledFields++;
                        }
                    });
                }
            });
        }
    });

    const progress = totalFields === 0 ? 100 : Math.round((filledFields / totalFields) * 100);

    return {
        progress,
        completed: true, // Optional sections are completed once visited
    };
} 