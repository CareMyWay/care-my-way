"use client";

import React, {useState, useEffect } from "react";
import Loading from "@/app/loading";
import {QuestionTab} from "@/components/quiz/question-tab";
import {staticQuizData} from "@/components/quiz/staticQuizData";
import type {Question} from "@/components/quiz/staticQuizData";
import { processQuizAnswers, processResultsForDisplay} from "@/components/quiz/quiz-logic";
import type { ProcessedResults } from "@/components/quiz/quiz-logic";

interface QuestionFrameProps {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    // (Reason: interface param name triggers rule in this repo; keeping for clarity)
    onQuizComplete: (results: ProcessedResults) => void;
}

const QuestionFrame = ({ onQuizComplete }: QuestionFrameProps) => {
    const [loading, setLoading] = useState(true);
    const [currQuestionIdx, setCurrQuestionIdx] = React.useState(1);

    const [questionPool, setQuestionPool] = useState<Question[]>([]);
    const [answerPool, setAnswerPool] = useState<number[]>([]);

    const handleQuizSubmit = () => {
        // Process the answers through our quiz logic
        console.log("Quiz submitted with answers:", answerPool);
        const raw = processQuizAnswers(answerPool);
        onQuizComplete(processResultsForDisplay(raw));

        console.log("Processed results:", processResultsForDisplay(raw));
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setQuestionPool(staticQuizData);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching quiz data:", error);
                setLoading(false);
            }
        };
        fetchQuizData().then(() => { });
    }, [currQuestionIdx]);

    if (loading) {
        return <Loading />;
    }

    if (!questionPool || !currQuestionIdx) {
        return <div className="h-2/3 flex items-center justify-center">Error loading quiz data</div>;
    }

    return (
    <>
        {/*<MarketplaceSearchBar />*/}
        <div className="h-4/5 py-8">
            <div className="max-w-6xl mx-auto">
            <QuestionTab
                currQuestionIdx={currQuestionIdx}
                setCurrQuestionIdxAction={setCurrQuestionIdx}
                questionPool={questionPool}
                answerPool={answerPool}
                setAnswerPoolAction={setAnswerPool}
                onQuizSubmit={handleQuizSubmit}
            />
            </div>
        </div>
    </>
    );
};

export default QuestionFrame;
