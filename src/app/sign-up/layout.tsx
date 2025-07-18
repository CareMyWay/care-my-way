import { CMWSideBySideHeader } from "@/components/headers/cmw-side-by-side-header";

export default function RegistrationLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <CMWSideBySideHeader />
      <div className=" min-h-screen items-center justify-center px-4 my-14 mt-6 md:mt-4 flex flex-col  bg-primary-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}
