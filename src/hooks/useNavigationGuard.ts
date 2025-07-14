import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseNavigationGuardProps {
    isEnabled: boolean;
    hasUnsavedChanges: boolean;
    message?: string;
}

export function useNavigationGuard({
    isEnabled,
    hasUnsavedChanges,
    message = "You have unsaved changes. Are you sure you want to leave this page?",
}: UseNavigationGuardProps) {
    const router = useRouter();

    // Handle browser refresh/close
    useEffect(() => {
        if (!isEnabled || !hasUnsavedChanges) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = message;
            return message;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isEnabled, hasUnsavedChanges, message]);

    // Custom function for programmatic navigation
    const guardedNavigate = useCallback(
        (path: string) => {
            if (hasUnsavedChanges && isEnabled) {
                const confirmed = window.confirm(message);
                if (!confirmed) return false;
            }

            router.push(path);
            return true;
        },
        [hasUnsavedChanges, isEnabled, message, router]
    );

    // Function to bypass the guard
    const navigateWithoutGuard = useCallback(
        (path: string) => {
            router.push(path);
        },
        [router]
    );

    return {
        guardedNavigate,
        navigateWithoutGuard,
    };
} 