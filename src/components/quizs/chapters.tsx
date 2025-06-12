"use client"

import {useState, useEffect, SetStateAction, Dispatch} from "react"
import QuizSteps from "@/components/quizs/steps"
import CurrentQuizChapter from "@/components/quizs/curr-chapter";

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

interface QuizData {
  chapters: Chapter[]
}

interface Step {
  number: number
  label: string
}

interface QuizChaptersProps {
  currChIdxVal: number;
  stateSetCurChIdxAction: Dispatch<SetStateAction<number>>;
}

const QuizChapters = ({ currChIdxVal, stateSetCurChIdxAction }: QuizChaptersProps) => {

  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [steps, setSteps] = useState<Step[] | null>(null)
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch("/quiz.json")
        const data = await response.json()
        setQuizData(data)

        const additionalInfoChapter = data.chapters.find((chapter: Chapter) => chapter["chapter-idx"] === currChIdxVal)
        if (additionalInfoChapter) {
          setCurrentChapter(additionalInfoChapter)
        }
        const additionalInfoSteps: Step[] = data.chapters.map((r: Chapter) => ({
          number: r["chapter-idx"],
          label: r["chapter-str"]
        }));
        if (additionalInfoSteps) {
          setSteps(additionalInfoSteps)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching quiz data:", error)
        setLoading(false)
      }
    }
    fetchQuizData().then(r => { console.log("nothing here: " + r)});
  }, [currChIdxVal])

  if (loading) {
    return <div className="min-h-screen bg-[#e1eef0] flex items-center justify-center">Loading...</div>
  }

  if (!quizData || !currentChapter) {
    return <div className="min-h-screen bg-[#e1eef0] flex items-center justify-center">Error loading quiz data</div>
  }

  return (
    <>
      {/*<MarketplaceSearchBar />*/}
      <div className="min-h-screen bg-[#e1eef0] py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <QuizSteps currentStep={currChIdxVal} steps = {steps} stateSetCurChIdxAction={ stateSetCurChIdxAction }/>
          <CurrentQuizChapter chapter={currentChapter} stepFlag={(currChIdxVal===1 ? -1 : 0) + (currChIdxVal===steps.length ? 1 : 0)} stateSetCurChIdxAction={ stateSetCurChIdxAction }/>
        </div>
      </div>

    </>
  );
};

export default QuizChapters;
