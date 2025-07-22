import {Dispatch, SetStateAction} from "react";
import type {Question} from "@/components/quiz/staticQuizData";

interface ProgressStepsProps {
  currQuestionIdx: number;
  setCurrQuestionIdxAction: Dispatch<SetStateAction<number>>;
  questionPool: Question[];
  answerPool: number[];
}

export function QuestionIconPool({ currQuestionIdx, setCurrQuestionIdxAction, questionPool, answerPool }: ProgressStepsProps) {

  const handleClickIcon = (e: React.MouseEvent<HTMLDivElement>) => {
    const _qIdx = parseInt(e.currentTarget.children[0].textContent!);
    if (_qIdx > answerPool.length) return;
    setCurrQuestionIdxAction(_qIdx);
  };

  return (
    <div className="flex items-start mb-8 flex-wrap flex-grow">
      {questionPool.map((_q) => (
        <div key={_q["q-idx"]} className="flex flex-col items-center m-1" onClick={handleClickIcon}>
          <div
            className={`w-[53px] h-[53px] rounded-full flex items-center justify-center  text-2xl font-bold 
            ${(_q["q-idx"] == currQuestionIdx) ? "bg-dark-green text-primary-white" : ((_q["q-idx"] < answerPool.length) ? "bg-medium-green text-primary-white" : "border border-gray-400 text-gray-400")}`}
          >
            {_q["q-idx"]}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionIconPool;
