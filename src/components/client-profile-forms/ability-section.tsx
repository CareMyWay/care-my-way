/* eslint-disable no-unused-vars */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const abilitySchema = z.object({
  mobilityStatus: z.string().min(1, "Please select an option."),
  cognitiveDifficulties: z
    .array(z.string())
    .min(1, "Please select at least one option."),
  cognitiveDifficultiesOther: z.string().max(500).optional(),
  sensoryImpairments: z
    .array(z.string())
    .min(1, "Please select at least one option."),
  sensoryImpairmentsOther: z.string().max(500).optional(),
});

type AbilityFormFields = z.infer<typeof abilitySchema>;

interface AbilitySectionProps {
  onDataChange: (data: AbilityFormFields) => void;
  isCompleted: boolean;
  defaultValues?: AbilityFormFields;
}

export function AbilitySection({
  onDataChange,
  isCompleted,
  defaultValues,
}: AbilitySectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<AbilityFormFields>({
    mode: "onChange",
    defaultValues: defaultValues || {
      mobilityStatus: "",
      cognitiveDifficulties: [],
      sensoryImpairments: [],
    },
    resolver: zodResolver(abilitySchema),
  });

  const cognitiveValues = watch("cognitiveDifficulties") || [];
  const sensoryValues = watch("sensoryImpairments") || [];

  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as AbilityFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  return (
    <div className="h-full bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="p-6 h-full flex flex-col">
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
              Functional & Cognitive Abilities
            </h2>
            <p className="text-sm text-gray-600">
              Describe how you function day to day.
            </p>
          </div>
        </div>

        <form className="flex-1 overflow-y-auto space-y-6">
          {/* Mobility Status */}
          <div className="space-y-2">
            <label htmlFor="mobilityStatus" className="std-form-label">
              What best describes your current mobility status?
            </label>
            <select
              id="mobilityStatus"
              {...register("mobilityStatus")}
              className="std-form-input"
            >
              <option value="">Select one</option>
              <option value="Fully mobile without assistance">
                Fully mobile without assistance
              </option>
              <option value="Requires walking aid (e.g., cane, walker)">
                Requires walking aid (e.g., cane, walker)
              </option>
              <option value="Uses wheelchair">Uses wheelchair</option>
              <option value="Mostly immobile">Mostly immobile</option>
              <option value="Other">Other</option>
            </select>
            {errors.mobilityStatus && (
              <p className="text-sm text-red-600">
                {errors.mobilityStatus.message}
              </p>
            )}
          </div>

          {/* Cognitive Difficulties */}
          <div className="space-y-2">
            <label className="std-form-label">
              Do you experience any memory or cognitive difficulties?
            </label>
            <div className="space-y-1">
              {[
                "Short-term memory loss",
                "Difficulty concentrating",
                "Word-finding issues",
                "Problem-solving challenges",
                "None of the above",
              ].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={option}
                    {...register("cognitiveDifficulties")}
                    className="form-checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {cognitiveValues?.includes("None of the above") && (
              <div className="relative">
                <textarea
                  {...register("cognitiveDifficultiesOther")}
                  placeholder="Please describe any other difficulties or type 'None'"
                  className="std-form-input"
                  rows={3}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                  {watch("cognitiveDifficultiesOther")?.length || 0}/500
                </div>
              </div>
            )}
          </div>

          {/* Sensory Impairments */}
          <div className="space-y-2">
            <label className="std-form-label">
              Do you experience any sensory impairments?
            </label>
            <div className="space-y-1">
              {[
                "Visual impairment",
                "Hearing impairment",
                "Touch sensitivity or numbness",
                "Taste or smell loss",
                "None of the above",
              ].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={option}
                    {...register("sensoryImpairments")}
                    className="form-checkbox"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {sensoryValues?.includes("None of the above") && (
              <div className="relative">
                <textarea
                  {...register("sensoryImpairmentsOther")}
                  placeholder="Please describe any other impairments or type 'None'"
                  className="std-form-input"
                  rows={3}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                  {watch("sensoryImpairmentsOther")?.length || 0}/500
                </div>
              </div>
            )}
          </div>

          {/* Completion Indicator */}
          {isCompleted && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 text-green-700">
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
                <span className="text-sm font-medium">
                  Section completed! Click Next to continue.
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
