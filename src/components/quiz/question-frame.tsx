"use client";

import React, {useState, useEffect } from "react";
import Loading from "@/app/loading";
import {QuestionTab} from "@/components/quiz/question-tab";
import {QuestionIconPool} from "@/components/quiz/question-icon-pool";
import {QsWithVer} from "@/components/quiz/staticQuizData";
import type {QuestionCheckbox, QuestionRadio} from "@/components/quiz/staticQuizData";
import {fetchQuizAnswer} from "@/actions/fetchCommitQuiz";

const QuestionFrame = ( {currUserId} : {currUserId: string} ) => {
  const [loading, setLoading] = useState(true);
  const [currQuestionIdx, setCurrQuestionIdx] = React.useState(1);

  const [questionPool, setQuestionPool] = useState<(QuestionCheckbox | QuestionRadio)[]>([]);
  const [answerPool, setAnswerPool] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const objQsWithVer = new QsWithVer();

        fetchQuizAnswer(currUserId, objQsWithVer.getVerCurrInUse())
          .catch(e => {console.error("Fetch Quiz --> Front: Error fetching quiz data:", e);})
          .then( r => {
            console.info("Init Quiz --> Front: Fetched from backend", r[0]);
            setAnswerPool([... r[0].split(",").map((str: string) => parseInt(str))]);
          });

        setQuestionPool(objQsWithVer.getQuizCurrInUse());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        setLoading(false);
      }
    };
    fetchQuizData().then(() => { });
  }, [currQuestionIdx, currUserId]);

  if (loading) {
    return <Loading />;
  }

  if (!questionPool || !currQuestionIdx || questionPool.length === 0) {
    return <div className="h-2/3 flex items-center justify-center">Error loading quiz data</div>;
  }

  return (
    <>
      {/*<MarketplaceSearchBar />*/}
      <div className="h-4/5 py-8 flex flex-col lg:flex-row">
        <div className="flex-1">
          <QuestionIconPool currQuestionIdx={currQuestionIdx} setCurrQuestionIdxAction={ setCurrQuestionIdx } questionPool={questionPool} answerPool={answerPool}/>
        </div>
        <div className="flex-[3]">
          <QuestionTab
            currQuestionIdx={currQuestionIdx}
            setCurrQuestionIdxAction={ setCurrQuestionIdx }
            questionPool={questionPool}
            answerPool={answerPool}
            setAnswerPoolAction={setAnswerPool}
            currUserId={currUserId}
          />
        </div>
      </div>
    </>
  );
};

export default QuestionFrame;
