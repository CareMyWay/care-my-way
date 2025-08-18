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
    if (currQuestionIdx > 1) {
      setCurrQuestionIdxAction(currQuestionIdx - 1);
    }
  };

  const handleNext = () => {
    if (currQuestionIdx < questionPool.length) {
      setCurrQuestionIdxAction(currQuestionIdx + 1);
    }
  };

  const handleSubmit = () => {
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
    <div className="w-full mx-auto p-4">
      {/* Title and Description */}
      <div className="mb-10 text-center">
        <h3 className="text-3xl font-bold text-darkest-green mb-4">Care Needs Assessment</h3>
        <p className="text-lg text-darkest-green mb-8 max-w-6xl mx-auto">
          Answer each question to the best of your ability for the most accurate care recommendations. You can navigate between questions using the Next and Back buttons below. Please note that subsequent questions will only appear after answering the current question. 
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-m font-medium text-gray-700">Quiz Progress</span>
          <span className="text-m font-medium text-gray-700">{Math.round((currQuestionIdx / questionPool.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div 
            className="bg-medium-green h-2 rounded-full transition-all duration-300" 
            style={{width: `${(currQuestionIdx / questionPool.length) * 100}%`}}
          ></div>
        </div>
        <div className="text-center text-m text-gray-600">
          {currQuestionIdx} of {questionPool.length} questions completed
        </div>
      </div>

      {/* White Question Container */}
      <div className="bg-white rounded-lg p-8 border-2 border-gray-200 mb-10">
        {/* Question */}
        <div className="mb-7">
          <h2 className="text-lg md:text-lg font-medium text-darkest-green leading-relaxed">
            {currQuestionIdx}.  {q_obj["q-str"]}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-2">
          {q_obj["a-tp"] === "checkbox" ? (
            q_obj.checkboxes.map((str, i) => (
              <label 
                key={`${q_idx}-${i}`}
                className={`
                  block w-full p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${(lcl_a_pool[q_idx] & (1 << i)) !== 0 
                    ? 'border-medium-green shadow-md' 
                    : 'border-gray-200 bg-white hover:border-medium-green hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`${q_idx}-${i}`} 
                    className="sr-only" 
                    checked={(lcl_a_pool[q_idx] & (1 << i)) !== 0} 
                    onChange={handleChange}
                  />
                  <div className={`
                    w-6 h-6 rounded border-2 mr-4 flex items-center justify-center transition-all
                    ${(lcl_a_pool[q_idx] & (1 << i)) !== 0 
                      ? 'border-medium-green bg-medium-green' 
                      : 'border-gray-300'
                    }
                  `}>
                    {(lcl_a_pool[q_idx] & (1 << i)) !== 0 && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-lg text-darkest-green">{str}</span>
                </div>
              </label>
            ))
          ) : (
            q_obj.radios.map((str, i) => (
              <label 
                key={`${q_idx}-${i}`}
                className={`
                  block w-full p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${lcl_a_pool[q_idx] === i 
                    ? 'border-medium-green shadow-md' 
                    : 'border-gray-200 bg-white hover:border-medium-green hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    id={`${q_idx}-${i}`} 
                    name={`${q_idx}`}
                    className="sr-only" 
                    checked={lcl_a_pool[q_idx] === i} 
                    onChange={handleChange}
                  />
                  <div className={`
                    w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center transition-all
                    ${lcl_a_pool[q_idx] === i 
                      ? 'border-medium-green' 
                      : 'border-gray-300'
                    }
                  `}>
                    {lcl_a_pool[q_idx] === i && (
                      <div className="w-3 h-3 rounded-full bg-medium-green"></div>
                    )}
                  </div>
                  <span className="text-lg text-darkest-green">{str}</span>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        {currQuestionIdx > 1 ? (
          <OrangeButton onClick={handleBack} variant="action" className="px-13 py-3">
            Back
          </OrangeButton>
        ) : (
          <div></div>
        )}
        
        {currQuestionIdx < questionPool.length ? (
          <OrangeButton onClick={handleNext} variant="action" className="px-13 py-3">
            Next
          </OrangeButton>
        ) : (
          <OrangeButton onClick={handleSubmit} variant="action" className="px-13 py-3">
            Submit
          </OrangeButton>
        )}
      </div>
    </div>
  );
}
