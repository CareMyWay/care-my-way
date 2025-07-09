/* eslint-disable no-unused-vars */
"use client";

import { getCanadianProvinces } from "@/utils/canadian-provinces";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Zod schema
const addressSchema = z.object({
  address: z.string().min(10, "Street address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(2, "Province is required"),
  postalCode: z
    .string()
    .regex(
      /^T\d[A-Z] ?\d[A-Z]\d$/,
      "Postal code must be a valid Alberta postal code (e.g., T2N 1N4)"
    ),
});

const provinces = getCanadianProvinces();

type AddressFormFields = z.infer<typeof addressSchema>;

interface AddressSectionProps {
  onDataChange: (data: AddressFormFields) => void;
  isCompleted: boolean;
  defaultValues?: AddressFormFields;
}

export function AddressSection({
  onDataChange,
  isCompleted,
  defaultValues,
}: AddressSectionProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<AddressFormFields>({
    mode: "onChange",
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      address: "",
      city: "",
      province: "",
      postalCode: "",
    },
  });

  // Track and notify parent of progress
  useEffect(() => {
    const subscription = watch((value) => {
      onDataChange(value as AddressFormFields);
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
              "2"
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-darkest-green">
              Address Information
            </h2>
            <p className="text-sm text-gray-600">
              Please provide your residential address
            </p>
          </div>
        </div>

        {/* Form */}
        <form>
          <div className="flex-1 overflow-y-auto space-y-4">
            <div className="space-y-2">
              <label htmlFor="address" className="std-form-label">
                Street Address *
              </label>
              <input
                id="address"
                {...register("address")}
                className="std-form-input"
                placeholder="Enter street address"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="std-form-label">
                City *
              </label>
              <input
                id="city"
                {...register("city")}
                className="std-form-input"
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="province" className="std-form-label">
                Province *
              </label>
              <select
                id="province"
                {...register("province")}
                className="std-form-input"
              >
                <option value="">Select province</option>
                {provinces.map((province) => (
                  <option key={province.shortCode} value={province.shortCode}>
                    {province.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-sm text-red-600">
                  {errors.province.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="postalCode" className="std-form-label">
                Postal Code *
              </label>
              <input
                id="postalCode"
                {...register("postalCode")}
                className="std-form-input"
                placeholder="Enter postal code"
              />
              {errors.postalCode && (
                <p className="text-sm text-red-600">
                  {errors.postalCode.message}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Completion notice */}
        {isCompleted && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
      </div>
    </div>
  );
}
//
