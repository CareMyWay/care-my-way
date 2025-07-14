interface FormSectionHeaderProps {
    stepNumber: number;
    title: string;
    subtitle: string;
    isCompleted: boolean;
    progress?: number;
    showProgress?: boolean;
}

export function FormSectionHeader({
    stepNumber,
    title,
    subtitle,
    isCompleted,
    progress = 0,
    showProgress = false,
}: FormSectionHeaderProps) {
    return (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-[#4A9B9B] bg-[#4A9B9B] text-white"
                    }`}
            >
                {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    stepNumber
                )}
            </div>
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-darkest-green">{title}</h2>
                <p className="text-sm text-gray-600">{subtitle}</p>

                {showProgress && !isCompleted && progress > 0 && (
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">
                                {Math.round(progress)}% complete
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                                className="bg-[#4A9B9B] h-1 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 