import { useEffect, useRef } from "react";
import { CompleteProfileFormData } from "@/types/provider-profile-form";

const AUTO_SAVE_KEY = "provider-profile-draft";
const AUTO_SAVE_DELAY = 2000; // 2 seconds

export function useFormAutoSave(formData: CompleteProfileFormData, isEnabled: boolean = true) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Save form data to session storage
    const saveToStorage = (data: CompleteProfileFormData) => {
        try {
            const dataToSave = {
                ...data,
                timestamp: new Date().toISOString(),
            };
            sessionStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(dataToSave));
            console.log("Form auto-saved at", new Date().toLocaleTimeString());
        } catch (error) {
            console.warn("Failed to auto-save form data:", error);
        }
    };

    // Load form data from session storage
    const loadFromStorage = (): Partial<CompleteProfileFormData> | null => {
        try {
            const saved = sessionStorage.getItem(AUTO_SAVE_KEY);
            if (!saved) return null;

            const parsed = JSON.parse(saved);
            console.log("Loaded auto-saved form data from", new Date(parsed.timestamp).toLocaleTimeString());

            // Remove timestamp before returning
            const { timestamp, ...formData } = parsed;
            return formData;
        } catch (error) {
            console.warn("Failed to load auto-saved form data:", error);
            return null;
        }
    };

    // Clear auto-saved data
    const clearAutoSave = () => {
        try {
            sessionStorage.removeItem(AUTO_SAVE_KEY);
            console.log("Auto-saved form data cleared");
        } catch (error) {
            console.warn("Failed to clear auto-saved data:", error);
        }
    };

    // Auto-save on form data changes
    useEffect(() => {
        if (!isEnabled) return;

        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set new timeout for auto-save
        timeoutRef.current = setTimeout(() => {
            saveToStorage(formData);
        }, AUTO_SAVE_DELAY);

        // Cleanup timeout on component unmount
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [formData, isEnabled]);

    // Save immediately before page unload
    useEffect(() => {
        if (!isEnabled) return;

        const handleBeforeUnload = () => {
            saveToStorage(formData);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [formData, isEnabled]);

    return {
        loadFromStorage,
        clearAutoSave,
    };
} 