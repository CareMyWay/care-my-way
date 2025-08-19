/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema definition
const medicalSchema = z.object({
  medicalConditions: z
    .string()
    .min(1, "Please specify or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  surgeriesOrHospitalizations: z
    .string()
    .min(1, "Please specify or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  chronicIllnesses: z
    .string()
    .min(1, "Please specify or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  allergies: z
    .string()
    .min(1, "Please specify or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  medications: z
    .string()
    .min(1, "Please specify or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),
});

type MedicalFormFields = z.infer<typeof medicalSchema>;

interface MedicalSectionProps {
  onDataChange: (data: MedicalFormFields) => void;
  isCompleted: boolean;
  defaultValues?: MedicalFormFields;
}

const questions: {
  key: keyof MedicalFormFields;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "medicalConditions",
    label:
      "Do you have any medical conditions? If yes, please specify. Type 'NONE' if not applicable.",
    placeholder: "e.g., diabetes, asthma, hypertension...",
  },
  {
    key: "surgeriesOrHospitalizations",
    label:
      "Have you had any recent surgeries or hospitalizations? Type 'NONE' if not applicable.",
    placeholder: "Please include dates if possible",
  },
  {
    key: "chronicIllnesses",
    label:
      "Do you have any chronic illnesses? If yes, please specify. Type 'NONE' if not applicable.",
    placeholder: "e.g., heart disease, arthritis...",
  },
  {
    key: "allergies",
    label:
      "Do you have any allergies? If yes, please specify. Type 'NONE' if not applicable.",
    placeholder: "e.g., food, medication, environmental...",
  },
  {
    key: "medications",
    label:
      "Are you currently taking any medications? If yes, please specify. Type 'NONE' if not applicable.",
    placeholder: "List all prescribed and over-the-counter medications",
  },
];

export function MedicalSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: MedicalSectionProps) {
  const [step, setStep] = useState(0);

  const {
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm<MedicalFormFields>({
    mode: "onChange",
    defaultValues: defaultValues || {
      medicalConditions: "",
      surgeriesOrHospitalizations: "",
      chronicIllnesses: "",
      allergies: "",
      medications: "",
    },
    resolver: zodResolver(medicalSchema),
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as MedicalFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  const currentQuestion = questions[step];
  const totalSteps = questions.length;

  const handleNext = async () => {
    const valid = await trigger(currentQuestion.key);

    if (!valid) return;

    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    } else {
      // Last step → section complete
      const allValid = await trigger();
      if (allValid) {
        onDataChange(watch() as MedicalFormFields);
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
              step + 1
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Medical Information
            </h2>
            <p className="text-sm text-gray-600">
              Question {step + 1} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Single Question */}
        <form className="flex-1 flex flex-col justify-between">
          <div className="space-y-2">
            <label htmlFor={currentQuestion.key} className="std-form-label">
              {currentQuestion.label}
            </label>
            <div className="relative">
              <textarea
                key={currentQuestion.key} // force React to treat each step as a new input
                id={currentQuestion.key}
                {...register(currentQuestion.key)}
                className="std-form-input"
                rows={4}
                placeholder={currentQuestion.placeholder}
                maxLength={500}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                {watch(currentQuestion.key)?.length || 0}/500
              </div>
            </div>
            {errors[currentQuestion.key] && (
              <p className="text-sm text-red-600">
                {errors[currentQuestion.key]?.message as string}
              </p>
            )}
          </div>

          {/* Navigation / Completion */}
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
