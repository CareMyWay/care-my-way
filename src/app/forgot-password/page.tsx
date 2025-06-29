import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { CMWSideBySideHeader } from "@/components/headers/cmw-side-by-side-header";

export default function ForgotPasswordPage() {
  return (
    <div>
      <CMWSideBySideHeader />
      <ForgotPasswordForm />
    </div>
  );
}
