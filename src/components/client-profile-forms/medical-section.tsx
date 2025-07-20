/* eslint-disable no-unused-vars */
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema definition
const medicalSchema = z.object({
  medicalConditions: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  surgeriesOrHospitalizations: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  chronicIllnesses: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  allergies: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),

  medications: z
    .string()
    .min(4, "Please provide information or type 'none' if not applicable.")
    .max(500, "Too long (max 500 characters)."),
});

type MedicalFormFields = z.infer<typeof medicalSchema>;

interface MedicalSectionProps {
  onDataChange: (data: MedicalFormFields) => void;
  isCompleted: boolean;
  defaultValues?: MedicalFormFields;
}

export function MedicalSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: MedicalSectionProps) {
  const {
    register,
    watch,
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
              "5"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Medical Information
            </h2>
            <p className="text-sm text-gray-600">
              Share relevant medical information
            </p>
          </div>
        </div>

        {/* Form */}
        <form className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <label htmlFor="medicalConditions" className="std-form-label">
              Do you have any medical conditions? If yes, please specify. Type
              &quot;NONE&quot; if not applicable.
            </label>
            <div className="relative">
              <textarea
                id="medicalConditions"
                {...register("medicalConditions")}
                className="std-form-input"
                rows={8}
                maxLength={500}
                placeholder="e.g., diabetes, asthma, hypertension..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                {watch("medicalConditions")?.length || 0}/500
              </div>
            </div>
            {errors.medicalConditions && (
              <p className="text-sm text-red-600">
                {errors.medicalConditions.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="surgeriesOrHospitalizations"
              className="std-form-label"
            >
              Have you had any recent surgeries or hospitalizations? If yes,
              please specify reason and dates. Type &quot;NONE&quot; if not
              applicable.
            </label>
            <div className="relative">
              <textarea
                id="surgeriesOrHospitalizations"
                {...register("surgeriesOrHospitalizations")}
                className="std-form-input"
                rows={3}
                placeholder="Please include dates if possible"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                {watch("surgeriesOrHospitalizations")?.length || 0}/500
              </div>
            </div>
            {errors.surgeriesOrHospitalizations && (
              <p className="text-sm text-red-600">
                {errors.surgeriesOrHospitalizations.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="chronicIllnesses" className="std-form-label">
              Do you have any chronic illnesses? If yes, please specify. Type
              &quot;NONE&quot; if not applicable.
            </label>
            <div className="relative">
              <textarea
                id="chronicIllnesses"
                {...register("chronicIllnesses")}
                className="std-form-input"
                rows={2}
                placeholder="e.g., heart disease, arthritis..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                {watch("chronicIllnesses")?.length || 0}/500
              </div>
            </div>
            {errors.chronicIllnesses && (
              <p className="text-sm text-red-600">
                {errors.chronicIllnesses.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="allergies" className="std-form-label">
              Do you have any allergies? If yes, please specify. Type
              &quot;NONE&quot; if not applicable.
            </label>
            <div className="relative">
              <textarea
                id="allergies"
                {...register("allergies")}
                className="std-form-input"
                rows={2}
                placeholder="e.g., food, medication, environmental..."
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                {watch("allergies")?.length || 0}/500
              </div>
            </div>
            {errors.allergies && (
              <p className="text-sm text-red-600">{errors.allergies.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="medications" className="std-form-label">
              Are you currently taking any medications? If yes, please specify.
              Type &quot;NONE&quot; if not applicable.
            </label>
            <div className="relative">
              <textarea
                id="medications"
                {...register("medications")}
                className="std-form-input"
                rows={2}
                placeholder="List all prescribed and over-the-counter medications"
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
                {watch("medications")?.length || 0}/500
              </div>
            </div>
            {errors.medications && (
              <p className="text-sm text-red-600">
                {errors.medications.message}
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
