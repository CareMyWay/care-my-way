"use client";

import React, {useState, useEffect } from "react";
import Loading from "@/app/loading";
import {QuestionTab} from "@/components/quiz/question-tab";
import QuestionIconPool from "@/components/quiz/question-icon-pool";
import {QuizProgress} from "@/components/quiz/quiz-progress";
import {staticQuizData} from "@/components/quiz/staticQuizData";
import type {Question} from "@/components/quiz/staticQuizData";
import { processQuizAnswers, processResultsForDisplay, ProcessedResults } from "@/components/quiz/quiz-logic";

interface QuestionFrameProps {
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
    const rawResults = processQuizAnswers(answerPool);
    const processedResults = processResultsForDisplay(rawResults);
    
    console.log("Processed results:", processedResults);
    
    // Call the parent callback with results
    onQuizComplete(processedResults);
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
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold text-darkest-green mb-7">Care Needs Assessment</h3>
          <p className="text-lg text-darkest-green mb-8 mx-auto">
            Answer each question to the best of your ability for the most accurate care recommendations.
            You can navigate between questions using the numbered circles below or the Next/Back buttons.
            Please note that subsequent questions will become available only after completing the previous ones.
          </p>
          <div className="">
            <QuizProgress
              totalQuestions={questionPool.length}
              answeredQuestions={answerPool.filter(answer => answer !== undefined && answer !== null).length}
              showPercentage={true}
            />
          </div>
        </div>
        <div className="flex flex-row w-[100%]">
          <div className="w-1/4">
            <QuestionIconPool currQuestionIdx={currQuestionIdx} setCurrQuestionIdxAction={ setCurrQuestionIdx } questionPool={questionPool} answerPool={answerPool}/>
          </div>
          <div className="w-3/4 px-4">
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
      </div>
    </>
  );
};

export default QuestionFrame;
