import { LogoStepBar } from "@/components/auth/logo-step-bar";

export default function RegistrationLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <LogoStepBar />
      {/* <div className="flex flex-col items-center justify-center min-h-screen bg-primary-white dark:bg-gray-900"> */}
      <div className=" min-h-screen items-center justify-center px-4 my-14 mt-6 md:mt-4 flex flex-col  bg-primary-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}
