'use client'

import React, { Dispatch, SetStateAction } from "react"
import OrangeButton from "@/components/buttons/orange-button";
import {InputUnderline} from "@/components/inputs/input-underline";

interface Chapter {
  "chapter-idx": number
  "chapter-str": string
  questions: Question[]
}

interface Question {
  "q-idx": number
  "q-str": string
  answers: Answer[]
}

interface Answer {
  "a-tp": string
  checkboxes?: string[]
  radios?: string[]
  "a-size"?: number
}

interface QuizFormProps {
  chapter: Chapter;
  stepFlag: number;
  stateSetCurChIdxAction: Dispatch<SetStateAction<number>>;
}

export function CurrentQuizChapter({ chapter, stepFlag, stateSetCurChIdxAction }: QuizFormProps) {
  const setCurChIdx = stateSetCurChIdxAction;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted with:")
    // Handle form submission
  }
  return (
    <>
      <div className="bg-darkest-green rounded-lg p-8 text-white">
        <div className="flex items-center mb-6">
          <div className="w-[53px] h-[53px] rounded-full bg-primary-white text-darkest-green text-2xl flex items-center justify-center font-bold mr-4">
            {chapter["chapter-idx"]}
          </div>
          <h1 className="text-2xl font-bold">{chapter["chapter-str"]}</h1>
        </div>
        {
          chapter["chapter-idx"] === 1 && (<div> other page 1 </div>) ||
          chapter["chapter-idx"] === 2 && (<div> other page 2 </div>) ||
          chapter["chapter-idx"] === 3 && (<div> other page 3 </div>) ||
          (
            <form onSubmit={handleSubmit}>
              {chapter.questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-6 pl-6">
                  <p className="text-lg mt-1">{question["q-idx"] > 0 ? question["q-idx"] + ". " : ""} {question["q-str"]}</p>

                  {question.answers.map((answer, aIndex) => {
                    if (answer["a-tp"] === "textarea") {
                      const rows = answer["a-size"] || 4
                      return (
                        <textarea
                          key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex}`}
                          className="w-[90%] mt-3 bg-primary-white rounded-lg ml-[28px] p-2 text-darkest-green"
                          rows={rows}
                        ></textarea>
                      )
                    }
                    else if (answer["a-tp"] === "checkbox") {
                      return (
                        <div key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex}`}>
                          {answer.checkboxes.map((str, i) => (
                            <div className="flex mb-[4px] ml-[12px]" key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex + "-" + i}`}>
                              <input type="checkbox" key={i} value={i} id={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex + "-" + i}`}/>
                              <label className="ml-[6px]" htmlFor={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex + "-" + i}`}> {str}</label>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    else if (answer["a-tp"] === "input-underline") {
                      return (
                        <div key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex}`}>
                          <InputUnderline className="w-[90%] ml-[28px] border-input-border-gray mb-4" />
                        </div>
                      )
                    }
                    else if (answer["a-tp"] === "radio") {
                      return (
                        <div key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex}`}>
                          {answer.radios.map((str, i) => (
                            <div className="flex mb-[4px] ml-[12px]" key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex + "-" + i}`}>
                              <input type="radio" key={i} value={i} id={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex + "-" + i}`} name={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex}`}/>
                              <label className="ml-[6px]" htmlFor={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex + "-" + i}`}> {str}</label>
                            </div>
                          ))}
                        </div>
                      )
                    } else {
                      return (
                        <div key={`${chapter["chapter-idx"] + "-" + qIndex + "-" + aIndex}`}>
                          {answer["a-tp"]}
                        </div>
                      )
                    }
                  })}
                </div>
              ))}

              <div className="flex justify-between mt-8">
                <OrangeButton label={"CANCEL"} href={""} variant={"action"} />
                <div className="space-x-4">
                  <OrangeButton label={"BACK"} href={""} onClick={() => setCurChIdx(chapter["chapter-idx"] - 1)} variant={"action"} />

                  {
                    stepFlag === 1 && ( <OrangeButton label={"REVIEW"} href={""} onClick={() => {/* route to review page */}} variant={"action"} />) ||
                    stepFlag === 0 && ( <OrangeButton label={"NEXT"} href={""} onClick={() => setCurChIdx(chapter["chapter-idx"] + 1)} variant={"action"} />)
                  }

                </div>
              </div>
            </form>
          )
        }
      </div>
    </>
  )
}

export default CurrentQuizChapter;