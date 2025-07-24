import React from "react";
import { ProgressBar } from "./progress-bar";

interface QuizProgressProps {
    totalQuestions: number;
    answeredQuestions: number;
    className?: string;
    showPercentage?: boolean;
}

export function QuizProgress({
    totalQuestions,
    answeredQuestions,
    className = "",
    showPercentage = true
}: QuizProgressProps) {
  // Calculate progress percentage
    const progressPercentage = totalQuestions > 0
    ? (answeredQuestions / totalQuestions) * 100
    : 0;

return (
    <div className={`mb-6 pr-4 ${className}`}>
        <ProgressBar
        value={progressPercentage}
        showPercentage={showPercentage}
    />
    <div className="mt-2 text-sm text-darkest-green text-center">
        {answeredQuestions} of {totalQuestions} questions completed
    </div>
    </div>
);
}

export default QuizProgress;
