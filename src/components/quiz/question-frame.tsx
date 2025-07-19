"use client";

import React, {useState, useEffect } from "react";
import Loading from "@/app/loading";
import {QuestionTab} from "@/components/quiz/question-tab";
import QuestionIconPool from "@/components/quiz/question-icon-pool";
import {staticQuizData} from "@/components/quiz/staticQuizData";
import type {Question} from "@/components/quiz/staticQuizData";

const QuestionFrame = ( ) => {
  const [loading, setLoading] = useState(true);
  const [currQuestionIdx, setCurrQuestionIdx] = React.useState(1);

  const [questionPool, setQuestionPool] = useState<Question[]>([]);
  const [answerPool, setAnswerPool] = useState<number[]>([]);

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
      <div className="h-4/5 py-8 flex flex-row w-[100%]">
        <div className="w-1/4">
          <QuestionIconPool currQuestionIdx={currQuestionIdx} setCurrQuestionIdxAction={ setCurrQuestionIdx } questionPool={questionPool} answerPool={answerPool}/>
        </div>
        <div className="w-3/4 px-4">
          <QuestionTab currQuestionIdx={currQuestionIdx} setCurrQuestionIdxAction={ setCurrQuestionIdx } questionPool={questionPool} answerPool={answerPool} setAnswerPoolAction={setAnswerPool}/>
        </div>
      </div>
    </>
  );
};

export default QuestionFrame;
