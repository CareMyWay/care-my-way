/* eslint-disable no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const lifestyleSchema = z.object({
  typicalDay: z
    .string()
    .min(1, "Please provide required information.")
    .max(500),
  physicalActivity: z
    .string()
    .min(1, "Please provide information or type 'N/A' if not applicable.")
    .max(500),
  dietaryPreferences: z
    .string()
    .min(1, "Please provide information or type 'N/A' if not applicable.")
    .max(500),
  sleepHours: z.string().min(1, "Please select your sleep duration."),
  hobbies: z
    .string()
    .min(1, "Please provide information or type 'N/A' if not applicable.")
    .max(500),
  socialTime: z.enum(
    [
      "0 days/week",
      "1 day/week",
      "2 days/week",
      "3 days/week",
      "4 days/week",
      "5 days/week",
      "6 days/week",
      "7 days/week",
    ],
    {
      errorMap: () => ({ message: "Please select how many days per week." }),
    }
  ),
});

type LifestyleFormFields = z.infer<typeof lifestyleSchema>;

interface LifestyleSectionProps {
  onDataChange: (data: LifestyleFormFields) => void;
  isCompleted: boolean;
  defaultValues?: LifestyleFormFields;
}

export function LifestyleSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: LifestyleSectionProps) {
  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm<LifestyleFormFields>({
    mode: "onChange",
    defaultValues: defaultValues || {
      typicalDay: "",
      physicalActivity: "",
      dietaryPreferences: "",
      sleepHours: "",
      hobbies: "",
      socialTime: undefined,
    },
    resolver: zodResolver(lifestyleSchema),
  });

  const [step, setStep] = useState(0);

  const questions: {
    key: keyof LifestyleFormFields;
    label: string;
    type: "textarea" | "select";
    placeholder?: string;
    options?: string[];
  }[] = [
    {
      key: "typicalDay",
      label: "What does a typical day look like for you?",
      type: "textarea",
      placeholder:
        "E.g., Wake up at 7 AM, work 9-5, cook dinner, read, sleep by 11 PM",
    },
    {
      key: "physicalActivity",
      label:
        "Do you engage in regular physical activity or exercise? Please specify. Type 'N/A' if not applicable.",
      type: "textarea",
      placeholder: "E.g., Jog 3x/week, yoga on weekends",
    },
    {
      key: "dietaryPreferences",
      label:
        "Do you follow any dietary restrictions or preferences? Please specify. Type 'N/A' if not applicable.",
      type: "textarea",
      placeholder: "E.g., Vegetarian, gluten-free, intermittent fasting",
    },
    {
      key: "sleepHours",
      label: "On average, how many hours do you sleep per night?",
      type: "select",
      options: ["Less than 4 hours", "4-6 hours", "6-8 hours", "8+ hours"],
    },
    {
      key: "hobbies",
      label: "What are your favorite hobbies or interests?",
      type: "textarea",
      placeholder: "E.g., Painting, hiking, gaming, reading",
    },
    {
      key: "socialTime",
      label:
        "On average, how many days per week do you spend time with family or friends?",
      type: "select",
      options: [
        "0 days/week",
        "1 day/week",
        "2 days/week",
        "3 days/week",
        "4 days/week",
        "5 days/week",
        "6 days/week",
        "7 days/week",
      ],
    },
  ];

  const currentQuestion = questions[step];
  const totalSteps = questions.length;

  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as LifestyleFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  const handleNext = async () => {
    const valid = await trigger(currentQuestion.key);
    if (!valid) return;

    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else {
      // last step
      const allValid = await trigger();
      if (allValid) {
        onDataChange(watch() as LifestyleFormFields);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold ${
              isCompleted
                ? "border-green-500 bg-green-500 text-white"
                : "border-[#4A9B9B] bg-[#4A9B9B] text-white"
            }`}
          >
            {isCompleted ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              "6"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Lifestyle & Habits
            </h2>
            <p className="text-sm text-gray-600">
              Tell us more about your routine and preferences
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            <label htmlFor={currentQuestion.key} className="std-form-label">
              {currentQuestion.label}
            </label>

            {currentQuestion.type === "textarea" ? (
              <div className="relative">
                <textarea
                  key={currentQuestion.key} // force React to treat each step as a new input
                  id={currentQuestion.key}
                  {...register(currentQuestion.key)}
                  className="std-form-input"
                  rows={3}
                  maxLength={500}
                  placeholder={currentQuestion.placeholder}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                  {watch(currentQuestion.key)?.length || 0}/500
                </div>
              </div>
            ) : (
              <select
                id={currentQuestion.key}
                {...register(currentQuestion.key)}
                className="std-form-input"
              >
                <option value="">Select</option>
                {currentQuestion.options?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {errors[currentQuestion.key] && (
              <p className="text-sm text-red-600">
                {errors[currentQuestion.key]?.message}
              </p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 0}
              className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
            >
              Back
            </button>

            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 rounded bg-[#4A9B9B] text-white"
              >
                Next
              </button>
            ) : watch(currentQuestion.key)?.trim() ? (
              <div className="text-green-700 font-medium flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Lifestyle section complete! Click{" "}
                <span className="underline">Next</span> below to continue.
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Please answer this question to complete the section.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
