import React, {Dispatch, SetStateAction} from "react";
import type {Question} from "@/components/quiz/staticQuizData";
import OrangeButton from "@/components/buttons/orange-button";

interface ProgressStepsProps {
  currQuestionIdx: number;
  setCurrQuestionIdxAction: Dispatch<SetStateAction<number>>;
  questionPool: Question[];
  answerPool: number[];
  setAnswerPoolAction: Dispatch<SetStateAction<number[]>>;
  onQuizSubmit: () => void;
}

export function QuestionTab({ currQuestionIdx, setCurrQuestionIdxAction, questionPool, answerPool, setAnswerPoolAction, onQuizSubmit }: ProgressStepsProps) {
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
    onQuizSubmit();
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const [_que_idx, _opt_idx] = e.target.id.split("-");

    if (questionPool[parseInt(_que_idx) - 1]["a-tp"] === "checkbox") {
      const currentValue = lcl_a_pool[_que_idx] || 0;
      const optionBit = Math.pow(2, parseInt(_opt_idx));
      
      if (e.target.checked) {
        // Add this option by setting the bit
        lcl_a_pool[_que_idx] = currentValue | optionBit;
      } else {
        // Remove this option by clearing the bit
        lcl_a_pool[_que_idx] = currentValue & ~optionBit;
      }
    } else if (questionPool[parseInt(_que_idx) - 1]["a-tp"] === "radio") {
      lcl_a_pool[_que_idx] = parseInt(_opt_idx);
    } else {
      console.info(`Q${_que_idx}-OPT${_opt_idx}: Call Admin Now!`);
    }
    setAnswerPoolAction([...lcl_a_pool]);
    console.info(`Question ${_que_idx} answered:`, lcl_a_pool[_que_idx]);
    console.info("Full AnswerPool:", lcl_a_pool);
  };

  return (
    <>
      <div className="bg-primary-white border border-gray-300 rounded-lg p-8 text-darkest-green w-auto h-auto">
        <div className="flex items-center mb-5">
          <h2 className="text-2xl font-bold text-darkest-green mr-4">
            Question {currQuestionIdx}
          </h2>
        </div>
        <div key={q_idx} className="mb-6 min-h-1/2">
          <p className="text-lg mt-1 mb-3">{q_obj["q-str"]}</p>

          {["DUMMY-Length=1-Array"].map(() => {
            if (q_obj["a-tp"] === "checkbox") {
              return (
                <div key={`${q_idx}`}>
                  {q_obj.checkboxes.map((str, i) => (
                    <div className="flex mb-3 ml-[12px]" key={`${q_idx}-${i}`}>
                      <input type="checkbox" key={i} value={i} id={`${q_idx}-${i}`} className="w-5 h-5 mt-1 accent-medium-green" checked={(lcl_a_pool[q_idx] & (1 << i)) != 0} onChange={handleChange}/>
                      <label className="ml-3 text-lg" htmlFor={`${q_idx}-${i}`}> {str}</label>
                    </div>
                  ))}
                </div>
              );
            }
            else if (q_obj["a-tp"] === "radio") {
              return (
                <div key={`${q_idx}`}>
                  {q_obj.radios.map((str, i) => (
                    <div className="flex mb-3 ml-[12px]" key={`${q_idx}-${i}`}>
                      <input type="radio" key={i} value={i} id={`${q_idx}-${i}`} name={`${q_idx}`} className="w-5 h-5 mt-1 accent-medium-green" checked={lcl_a_pool[q_idx] == i} onChange={handleChange}/>
                      <label className="ml-3 text-lg" htmlFor={`${q_idx}-${i}`}> {str}</label>
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

        <div className="flex flex-row justify-between mt-15 items-end">
          {currQuestionIdx > 1 ?                   ( <OrangeButton onClick={handleBack} variant={"action"} >BACK</OrangeButton>) : (<span></span>)}
          {currQuestionIdx < questionPool.length ? ( <OrangeButton onClick={handleNext} variant={"action"} >NEXT</OrangeButton>) :
                                                   ( <OrangeButton onClick={handleSubmit} variant={"action"} >SUBMIT</OrangeButton>)}
        </div>
      </div>
    </>
  );
}
