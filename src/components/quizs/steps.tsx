import {Dispatch, SetStateAction} from "react";

interface Step {
  number: number
  label: string
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
  stateSetCurChIdxAction: Dispatch<SetStateAction<number>>;
}

export function QuizSteps({ currentStep, steps, stateSetCurChIdxAction }: ProgressStepsProps) {
  const setCurChIdx = stateSetCurChIdxAction;

  return (
    <div className="flex justify-between mb-8 h-[100px]">
      {steps.map((step) => (
        <div key={step.number} className="flex flex-col items-center" onClick={() => setCurChIdx(step.number)}>
          <div
            className={`w-[53px] h-[53px] rounded-full flex items-center justify-center text-primary-white text-2xl font-bold ${
              step.number === currentStep ? "bg-primary-orange" : "bg-darkest-green"
            }`}
          >
            {step.number}
          </div>
          <div className={`text-center mt-2 text-xs max-w-[120px]`}>{step.label}</div>
        </div>
      ))}
    </div>
  )
}

export default QuizSteps;