// app/forgot-password/page.tsx
import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { LogoStepBar } from "@/components/auth/logo-step-bar";

export default function ForgotPasswordPage() {
  return (
    <div>
      <LogoStepBar />
      <ForgotPasswordForm />
    </div>
  );
}
