"use client";

import React, { useState } from "react";
import OrangeButton from "@/components/buttons/orange-button";
import QuestionFrame from "@/components/quiz/question-frame";
import QuizResults from "@/components/quiz/quiz-results";
import { ProcessedResults } from "@/components/quiz/quiz-logic";

export function QuizLanding() {
    const [currentView, setCurrentView] = useState<"landing" | "questions" | "results">("landing");
    const [quizResults, setQuizResults] = useState<ProcessedResults | null>(null);

    const handleStartQuiz = () => {
        setCurrentView("questions");
    };

    const handleQuizComplete = (results: ProcessedResults) => {
        setQuizResults(results);
        setCurrentView("results");
    };

    const handleStartOver = () => {
        setCurrentView("landing");
        setQuizResults(null);
    };

    if (currentView === "results" && quizResults) {
        return <QuizResults results={quizResults} onStartOver={handleStartOver} />;
    }

    if (currentView === "questions") {
        return <QuestionFrame onQuizComplete={handleQuizComplete} />;
    }

return (
    <div className="min-h-screen bg-primary-white py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
        {/* Main Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-darkest-green mb-4 sm:mb-6">
            Care Needs Assessment
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-darkest-green mb-6 sm:mb-8 max-w-full sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Discover the right type of care and support services tailored to your unique needs.
            Our comprehensive assessment will help you understand your care options and filter our healthcare directly according to your needs.
            </p>
        </div>
        {/* Start Assessment Button */}
        <div className="mb-12 sm:mb-16 lg:mb-20 text-center">
            <OrangeButton
                onClick={handleStartQuiz}
                variant="action"
                className="text-lg sm:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 min-h-[48px] touch-manipulation"
            >
                Start Assessment
            </OrangeButton>
        </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* Comprehensive Assessment */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-medium-green rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-2xl md:text-3xl text-white font-bold">20</span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-darkest-green mb-2 sm:mb-3">
                Comprehensive Assessment
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-darkest-green leading-relaxed">
                20 carefully designed questions covering health, mobility, safety, and support needs
            </p>
            </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-medium-green rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-lg sm:text-2xl md:text-3xl text-white">✓</span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-darkest-green mb-2 sm:mb-3">
                Personalized Recommendations
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-darkest-green leading-relaxed">
                Get specific care type recommendations with detailed explanations of services and professionals
            </p>
            </div>
        </div>

        {/* Professional Guidance */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-medium-green rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-3xl sm:text-5xl md:text-6xl text-white">+</span>
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-darkest-green mb-2 sm:mb-3">
                Professional Guidance
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-darkest-green leading-relaxed">
                Learn about different healthcare professionals and how they can support your specific needs
            </p>
            </div>
        </div>
        </div>

        {/* Additional CTA Section */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
        <p className="text-darkest-green text-base sm:text-lg md:text-xl mb-4 sm:mb-6 px-4 sm:px-0">
            Take the first step towards finding the right care solution for you or your loved one.
        </p>
        </div>
    </div>
);
}

export default QuizLanding;
