import React, {Dispatch, SetStateAction} from "react";
import {QsWithVer, Question} from "@/components/quiz/staticQuizData";
import OrangeButton from "@/components/buttons/orange-button";
import {pushQuizAnswer} from "@/actions/fetchCommitQuiz";
// import { getCurrentUserServer } from "@/utils/amplify-server-utils";

interface ProgressStepsProps {
  currQuestionIdx: number;
  setCurrQuestionIdxAction: Dispatch<SetStateAction<number>>;
  questionPool: Question[];
  answerPool: number[];
  setAnswerPoolAction: Dispatch<SetStateAction<number[]>>;
  currUserId: string;
}

export function QuestionTab({ currQuestionIdx, setCurrQuestionIdxAction, questionPool, answerPool, setAnswerPoolAction, currUserId }: ProgressStepsProps) {

  // console.info(`currQuestionIdx: ${currQuestionIdx}`);
  const q_obj = questionPool[currQuestionIdx - 1];
  const q_idx = currQuestionIdx;
  const lcl_a_pool = [... answerPool];

  const handleBack = () => {
    setCurrQuestionIdxAction(currQuestionIdx - 1   );
  };

  const handleNext = () => {
    if (currQuestionIdx >= answerPool.length) return;
    setCurrQuestionIdxAction(currQuestionIdx - (-1));
  };

  const handleSubmit = () =>{
    if (currQuestionIdx >= answerPool.length) return;
    alert(answerPool);
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const [_que_idx, _opt_idx] = e.target.id.split("-");

    if (questionPool[parseInt(_que_idx) - 1]["a-tp"] === "checkbox") {
      lcl_a_pool[_que_idx] = Math.pow(2, parseInt(_opt_idx)) * (e.target.checked === true ? 1 : -1) + (lcl_a_pool[_que_idx] || 0);
    } else if (questionPool[parseInt(_que_idx) - 1]["a-tp"] === "radio") {
      lcl_a_pool[_que_idx] = _opt_idx;
    } else {
      console.info(`Q${_que_idx}-OPT${_opt_idx}: Call Admin Now!`);
    }
    setAnswerPoolAction(lcl_a_pool);
    console.info(`OnClick Show AnswerPool: ${lcl_a_pool}`);

    const objQsWithVer = new QsWithVer();
    pushQuizAnswer(currUserId, objQsWithVer.getVerCurrInUse(), lcl_a_pool.toString())
      .catch(e => {console.error("Push Quiz --> Back: Error committing quiz data:", e);})
      .then((_r) => {
        if (!_r) return;
        console.info("Push Quiz  -->  Back: Synced with backend");
      });
  };

  return (
    <>
      <div className="bg-darkest-green rounded-lg p-8 text-primary-white w-auto h-auto">
        <div className="flex items-center mb-6">
          <div className="w-[53px] h-[53px] rounded-full bg-primary-white text-darkest-green text-2xl flex items-center justify-center font-bold mr-4">
            {currQuestionIdx}
          </div>
        </div>
        <div key={q_idx} className="mb-6 pl-6 min-h-1/2">
          <p className="text-lg mt-1">{q_obj["q-idx"] > 0 ? `${q_obj["q-idx"]}. ` : ""} {q_obj["q-str"]}</p>

          {["DUMMY-Length=1-Array"].map(() => {
            if (q_obj["a-tp"] === "checkbox") {
              return (
                <div key={`${q_idx}`}>
                  {q_obj.checkboxes.map((str, i) => (
                    <div className="flex mb-[4px] ml-[12px]" key={`${q_idx}-${i}`}>
                      <input type="checkbox" key={i} value={i} id={`${q_idx}-${i}`} checked={(lcl_a_pool[q_idx] & (1 << i)) != 0} onChange={handleChange}/>
                      <label className="ml-[6px]" htmlFor={`${q_idx}-${i}`}> {str}</label>
                    </div>
                  ))}
                </div>
              );
            }
            else if (q_obj["a-tp"] === "radio") {
              return (
                <div key={`${q_idx}`}>
                  {q_obj.radios.map((str, i) => (
                    <div className="flex mb-[4px] ml-[12px]" key={`${q_idx}-${i}`}>
                      <input type="radio" key={i} value={i} id={`${q_idx}-${i}`} name={`${q_idx}`} checked={lcl_a_pool[q_idx] == i} onChange={handleChange}/>
                      <label className="ml-[6px]" htmlFor={`${q_idx}-${i}`}> {str}</label>
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <div key={`${q_idx}`}>
                  {q_obj["a-tp"]}
                </div>
              );
            }
          })}
        </div>
        <div className="flex flex-row justify-between mt-8 items-end">
          {currQuestionIdx > 1 ?                   ( <OrangeButton onClick={handleBack} variant={"action"} >BACK</OrangeButton>) : (<span></span>)}
          {currQuestionIdx < questionPool.length ? ( <OrangeButton onClick={handleNext} variant={"action"} >NEXT</OrangeButton>) :
                                                   ( <OrangeButton onClick={handleSubmit} variant={"action"} >SUBMIT</OrangeButton>)}
        </div>
      </div>
    </>
  );
}
