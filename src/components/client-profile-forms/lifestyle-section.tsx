/* eslint-disable no-unused-vars */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const lifestyleSchema = z.object({
  typicalDay: z
    .string()
    .min(4, "Please provide required information.")
    .max(500),
  physicalActivity: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500),
  dietaryPreferences: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500),
  sleepHours: z.string(),
  hobbies: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
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
    formState: { errors },
  } = useForm<LifestyleFormFields>({
    mode: "onChange",
    defaultValues: defaultValues || {
      typicalDay: "",
      physicalActivity: "",
      dietaryPreferences: "",
      sleepHours: "",
      hobbies: "",
      // socialTime is omitted so it will be undefined by default
    },
    resolver: zodResolver(lifestyleSchema),
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as LifestyleFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

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
        <form className="flex-1 overflow-y-auto space-y-6">
          {[
            ["typicalDay", "What does a typical day look like for you?"],
            [
              "physicalActivity",
              "Do you engage in regular physical activity or exercise? Type 'N/A' if not applicable.",
            ],
            [
              "dietaryPreferences",
              "Do you follow any dietary restrictions or preferences? Type 'N/A' if not applicable.",
            ],
            ["hobbies", "What are your favorite hobbies or interests?"],
          ].map(([field, label]) => (
            <div className="space-y-2" key={field}>
              <label htmlFor={field} className="std-form-label">
                {label}
              </label>
              <div className="relative">
                <textarea
                  id={field}
                  {...register(field as keyof LifestyleFormFields)}
                  className="std-form-input"
                  rows={3}
                  maxLength={500}
                  placeholder={
                    field === "typicalDay"
                      ? "E.g., Wake up at 7 AM, work 9-5, cook dinner, read, sleep by 11 PM"
                      : field === "physicalActivity"
                        ? "E.g., Jog 3x/week, yoga on weekends"
                        : field === "dietaryPreferences"
                          ? "E.g., Vegetarian, gluten-free, intermittent fasting"
                          : field === "hobbies"
                            ? "E.g., Painting, hiking, gaming, reading"
                            : ""
                  }
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                  {watch(field as keyof LifestyleFormFields)?.length || 0}/500
                </div>
              </div>
              {errors[field as keyof LifestyleFormFields] && (
                <p className="text-sm text-red-600">
                  {errors[field as keyof LifestyleFormFields]?.message}
                </p>
              )}
            </div>
          ))}

          {/* Sleep Hours Select */}
          <div className="space-y-2">
            <label htmlFor="sleepHours" className="std-form-label">
              On average, how many hours do you sleep per night?
            </label>
            <select
              id="sleepHours"
              {...register("sleepHours")}
              className="std-form-input"
            >
              <option value="">Select duration</option>
              <option value="Less than 4 hours">Less than 4 hours</option>
              <option value="4-6 hours">4-6 hours</option>
              <option value="6-8 hours">6-8 hours</option>
              <option value="8+ hours">8+ hours</option>
            </select>
            {errors.sleepHours && (
              <p className="text-sm text-red-600">
                {errors.sleepHours.message}
              </p>
            )}
          </div>

          {/* Social Time Select */}
          <div className="space-y-2">
            <label htmlFor="socialTime" className="std-form-label">
              How many days per week do you spend time with family or friends?
            </label>
            <select
              id="socialTime"
              {...register("socialTime")}
              className="std-form-input"
            >
              <option value="">Select days</option>
              <option value="0 days/week">0 days/week</option>
              <option value="1 day/week">1 day/week</option>
              <option value="2 days/week">2 days/week</option>
              <option value="3 days/week">3 days/week</option>
              <option value="4 days/week">4 days/week</option>
              <option value="5 days/week">5 days/week</option>
              <option value="6 days/week">6 days/week</option>
              <option value="7 days/week">7 days/week</option>
            </select>
            {errors.socialTime && (
              <p className="text-sm text-red-600">
                {errors.socialTime.message}
              </p>
            )}
          </div>

          {/* Completion indicator */}
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
                  All sections completed! Ready to submit.
                </span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
