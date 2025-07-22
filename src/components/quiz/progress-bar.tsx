"use client"

import * as React from "react"

interface ProgressBarProps {
    value: number; // Progress percentage (0-100)
    className?: string;
    showPercentage?: boolean;
}

const ProgressBar = React.forwardRef<
    HTMLDivElement,
    ProgressBarProps
>(({ className = "", value, showPercentage = false, ...props }, ref) => {
  // Ensure value is between 0 and 100
    const clampedValue = Math.min(Math.max(value || 0, 0), 100);

return (
    <div className={`w-full ${className}`} {...props} ref={ref}>
    {showPercentage && (
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-darkest-green">Quiz  Progress</span>
            <span className="text-sm font-medium text-darkest-green">{Math.round(clampedValue)}%</span>
        </div>
    )}
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
            className="h-full bg-medium-green transition-all duration-300 ease-in-out rounded-full"
            style={{ width: `${clampedValue}%` }}
        />
        </div>
    </div>
);
});

ProgressBar.displayName = "ProgressBar";

export { ProgressBar };
