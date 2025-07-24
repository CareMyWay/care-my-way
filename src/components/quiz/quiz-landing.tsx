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
    <div className="min-h-screen bg-primary-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
        {/* Main Header Section */}
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-darkest-green mb-6">
            Care Needs Assessment
            </h1>
            <p className="text-lg md:text-xl text-darkest-green mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover the right type of care and support services tailored to your unique needs.
            Our comprehensive assessment will help you understand your care options and filter our healthcare directly according to your needs.
            </p>
        </div>
          {/* Start Assessment Button */}
        <div className="mb-16 text-center">
            <OrangeButton 
                onClick={handleStartQuiz}
                variant="action"
                className="text-xl px-8 py-4"
            >
                Start Assessment
            </OrangeButton>
        </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Comprehensive Assessment */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-center">
            <div className="w-16 h-16 bg-medium-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white font-bold">20</span>
            </div>
            <h3 className="text-xl font-bold text-darkest-green mb-3">
                Comprehensive Assessment
            </h3>
            <p className="text-darkest-green leading-relaxed">
                20 carefully designed questions covering health, mobility, safety, and support needs
            </p>
            </div>
        </div>

          {/* Personalized Recommendations */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-center">
            <div className="w-16 h-16 bg-medium-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">✓</span>
            </div>
            <h3 className="text-xl font-bold text-darkest-green mb-3">
                Personalized Recommendations
            </h3>
            <p className="text-darkest-green leading-relaxed">
                Get specific care type recommendations with detailed explanations of services and professionals
            </p>
            </div>
        </div>

          {/* Professional Guidance */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="text-center">
            <div className="w-16 h-16 bg-medium-green rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">👩‍⚕️</span>
            </div>
            <h3 className="text-xl font-bold text-darkest-green mb-3">
                Professional Guidance
            </h3>
            <p className="text-darkest-green leading-relaxed">
                Learn about different healthcare professionals and how they can support your specific needs
            </p>
            </div>
        </div>
        </div>

        {/* Additional CTA Section */}
        <div className="text-center mt-12">
        <p className="text-darkest-green text-lg mb-6">
            Take the first step towards finding the right care solution for you or your loved one.
        </p>
        </div>
    </div>
);
}

export default QuizLanding;
