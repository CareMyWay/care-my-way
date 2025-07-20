/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the Zod schema
const emergencySchema = z
  .object({
    contactFirstName: z.string().min(2, "Contact first name is required"),
    contactLastName: z.string().min(2, "Contact last name is required"),
    relationship: z.string().min(2, "Relationship is required"),
    contactPhone: z
      .string()
      .min(10, "Phone number is required")
      .regex(/^\d{10}$/, "Phone number must be 10 digits"),
    supportPerson: z.enum(["", "Yes", "No"], {
      errorMap: () => ({ message: "Please select Yes or No" }),
    }),
    supportFirstName: z.string().optional(),
    supportLastName: z.string().optional(),
    supportRelationship: z.string().optional(),
    supportPhone: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.supportPerson === "Yes") {
        return (
          !!data.supportFirstName?.trim() &&
          !!data.supportLastName?.trim() &&
          !!data.supportRelationship?.trim() &&
          /^\d{10}$/.test(data.supportPhone ?? "")
        );
      }
      return true; // if No or empty
    },
    {
      message:
        "All support person fields are required and must be valid if 'Yes' is selected.",
      path: ["supportPhoneNumber"],
    }
  );

type EmergencyFormFields = z.infer<typeof emergencySchema>;

interface EmergencyContactSectionProps {
  onDataChange: (data: EmergencyFormFields) => void;
  isCompleted: boolean;
  defaultValues?: EmergencyFormFields;
}

// Common relationship options
const relationshipOptions = [
  "Spouse/Partner",
  "Parent",
  "Child",
  "Sibling",
  "Other Family Member",
  "Friend",
  "Colleague",
  "Other",
];

export function EmergencyContactSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: EmergencyContactSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmergencyFormFields>({
    mode: "onChange",
    defaultValues: defaultValues || {
      contactFirstName: "",
      contactLastName: "",
      relationship: "",
      contactPhone: "",
      supportPerson: "",
      supportFirstName: "",
      supportLastName: "",
      supportRelationship: "",
      supportPhone: "",
    },
    resolver: zodResolver(emergencySchema),
  });

  const [hasSupportPerson, setHasSupportPerson] = useState("");
  const [sameAsEmergency, setSameAsEmergency] = useState(false);

  const watchedFields = watch();

  //Sync form changes with parent component
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as EmergencyFormFields);
    });
    return () => subscription.unsubscribe();
  }, [watch, onDataChange]);

  //Auto-full or clear support person field based on "Same as Emergency Contact" checkbox
  useEffect(() => {
    if (sameAsEmergency) {
      setValue("supportFirstName", watchedFields.contactFirstName);
      setValue("supportLastName", watchedFields.contactLastName);
      setValue("supportRelationship", watchedFields.relationship);
      setValue("supportPhone", watchedFields.contactPhone);
    } else {
      setValue("supportFirstName", "");
      setValue("supportLastName", "");
      setValue("supportRelationship", "");
      setValue("supportPhone", "");
    }
  }, [sameAsEmergency]);

  //Initialize hasSupportPerson toggle from default values
  useEffect(() => {
    if (
      defaultValues?.supportPerson === "Yes"
      // defaultValues?.supportPerson === true
    ) {
      setHasSupportPerson("Yes");
    } else if (defaultValues?.supportPerson === "No") {
      setHasSupportPerson("No");
    }
  }, [defaultValues]);

  useEffect(() => {
    if (
      defaultValues?.supportFirstName === defaultValues?.contactFirstName &&
      defaultValues?.supportLastName === defaultValues?.contactLastName &&
      defaultValues?.supportRelationship === defaultValues?.relationship &&
      defaultValues?.supportPhone === defaultValues?.contactPhone
    ) {
      setSameAsEmergency(true);
    }
  }, [defaultValues]);

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
              "3"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Emergency Contact
            </h2>
            <p className="text-sm text-gray-600">
              Please provide emergency contact details
            </p>
          </div>
        </div>

        {/* Form */}
        <form>
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contactFirstName" className="std-form-label">
                    Contact First Name *
                  </label>
                  <input
                    id="contactFirstName"
                    {...register("contactFirstName")}
                    className="std-form-input"
                    placeholder="Enter contact's first name"
                  />
                  {errors.contactFirstName && (
                    <p className="text-sm text-red-600">
                      {errors.contactFirstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="contactLastName" className="std-form-label">
                    Contact Last Name *
                  </label>
                  <input
                    id="contactLastName"
                    {...register("contactLastName")}
                    className="std-form-input"
                    placeholder="Enter contact's last name"
                  />
                  {errors.contactLastName && (
                    <p className="text-sm text-red-600">
                      {errors.contactLastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="relationship" className="std-form-label">
                  Relationship *
                </label>
                <select
                  id="relationship"
                  {...register("relationship")}
                  className="std-form-input"
                >
                  <option value="">Select relationship</option>
                  {relationshipOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className="text-sm text-red-600">
                    {errors.relationship.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="contactPhone" className="std-form-label">
                  Phone Number *
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  {...register("contactPhone")}
                  className="std-form-input"
                  placeholder="Enter 10-digit phone number"
                />
                {errors.contactPhone && (
                  <p className="text-sm text-red-600">
                    {errors.contactPhone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="supportPerson" className="std-form-label">
                  Do you have a Support Person that will represent you? *
                </label>
                <select
                  {...register("supportPerson")}
                  className="std-form-input"
                  onChange={(e) => {
                    const supportValue = e.target.value;
                    setHasSupportPerson(supportValue);
                    setValue(
                      "supportPerson",
                      supportValue as "" | "Yes" | "No"
                    );

                    if (supportValue === "No") {
                      setSameAsEmergency(false); // Reset checkbox too
                      setValue("supportFirstName", "");
                      setValue("supportLastName", "");
                      setValue("supportRelationship", "");
                      setValue("supportPhone", "");
                    }
                  }}
                >
                  <option value="">Select an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors.supportPerson && (
                  <p className="text-sm text-red-600">
                    {errors.supportPerson.message}
                  </p>
                )}
              </div>
              {hasSupportPerson === "Yes" && (
                <div className="flex flex-col items-start space-x-2">
                  <label className="std-form-label">Support Person</label>
                  <span className="my-2">
                    <input
                      type="checkbox"
                      id="consentCheckbox"
                      className="h-4 w-4 text-medium-green border-gray-300 rounded focus:ring-dark-green"
                      checked={sameAsEmergency}
                      onChange={(e) => setSameAsEmergency(e.target.checked)}
                    />
                    <label
                      htmlFor="consentCheckbox"
                      className="text-md text-darkest-green ms-1"
                    >
                      Same as Emergency Contact
                    </label>
                  </span>

                  <div className="space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="supportFirstName"
                          className="std-form-label"
                        >
                          Support First Name *
                        </label>
                        <input
                          id="supportFirstName"
                          {...register("supportFirstName")}
                          className="std-form-input"
                          placeholder="Enter support person's first name"
                        />
                        {errors.supportFirstName && (
                          <p className="text-sm text-red-600">
                            {errors.supportFirstName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="supportLastName"
                          className="std-form-label"
                        >
                          Support Last Name *
                        </label>
                        <input
                          id="supportLastName"
                          {...register("supportLastName")}
                          className="std-form-input"
                          placeholder="Enter support's last name"
                        />
                        {errors.supportLastName && (
                          <p className="text-sm text-red-600">
                            {errors.supportLastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="supportRelationship"
                        className="std-form-label"
                      >
                        Relationship with Support Person*
                      </label>
                      <select
                        id="supportRelationship"
                        {...register("supportRelationship")}
                        className="std-form-input"
                      >
                        <option value="">Select relationship</option>
                        {relationshipOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.supportRelationship && (
                        <p className="text-sm text-red-600">
                          {errors.supportRelationship.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="supportPhone" className="std-form-label">
                        Phone Number *
                      </label>
                      <input
                        id="supportPhone"
                        type="tel"
                        {...register("supportPhone")}
                        className="std-form-input"
                        placeholder="Enter 10-digit phone number"
                      />
                      {errors.supportPhone && (
                        <p className="text-sm text-red-600">
                          {errors.supportPhone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Completion Status */}

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
