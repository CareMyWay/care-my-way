"use client";

import React, { useState } from "react";
import {
  resetPassword,
  confirmResetPassword,
  type ResetPasswordOutput,
} from "aws-amplify/auth";

import { useFormStatus } from "react-dom";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import OrangeButton from "@/components/buttons/orange-button";
import CMWStackedHeader from "@/components/headers/cmw-stacked-header";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<"REQUEST" | "CONFIRM" | "DONE">("REQUEST");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const { pending } = useFormStatus();

  const handleResetPassword = async (email: string) => {
    try {
      const output: ResetPasswordOutput = await resetPassword({
        username: email,
      });
      const { nextStep } = output;

      if (nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE") {
        setStep("CONFIRM");
        setMessage(
          `A confirmation code was sent via ${nextStep.codeDeliveryDetails?.deliveryMedium}.`
        );
      } else if (nextStep.resetPasswordStep === "DONE") {
        setStep("DONE");
        setMessage("Password reset complete. You can now log in.");
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Failed to start password reset.");
    }
  };

  const handleConfirmResetPassword = async () => {
    try {
      await confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword,
      });
      setStep("DONE");
      setMessage("Password successfully reset. You can now log in.");
    } catch (error: any) {
      console.error(error);
      setMessage(error.message || "Failed to confirm new password.");
    }
  };

  return (
    <main className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back to login */}
        <div>
          <Link
            href="/login"
            className="flex items-center text-sm text-darkest-green hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to login
          </Link>
        </div>
        <div className="mt-20">
          <CMWStackedHeader title="Reset Your Password" />
        </div>

        <form className="space-y-4">
          {step === "REQUEST" && (
            <>
              <label
                className="std-form-label text-darkest-green"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="std-form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <OrangeButton
                className="mt-2 w-full"
                variant="action"
                type="button"
                onClick={() => handleResetPassword(username)}
              >
                Send Reset Code
              </OrangeButton>
            </>
          )}

          {step === "CONFIRM" && (
            <>
              <label
                className="std-form-label text-darkest-green"
                htmlFor="code"
              >
                Confirmation Code
              </label>
              <input
                type="text"
                id="code"
                className="std-form-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <label
                className="std-form-label text-darkest-green"
                htmlFor="new-password"
              >
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="std-form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <OrangeButton
                className="w-full"
                variant="action"
                type="button"
                onClick={handleConfirmResetPassword}
              >
                Reset Password
              </OrangeButton>
            </>
          )}

          {step === "DONE" && (
            <p className="text-green-600 font-medium">
              {message}{" "}
              <a className="underline text-blue-600" href="/login">
                Log in
              </a>
            </p>
          )}

          {message && step !== "DONE" && (
            <p className="text-sm text-red-500 mt-2">{message}</p>
          )}
        </form>
      </div>
    </main>
  );
}
