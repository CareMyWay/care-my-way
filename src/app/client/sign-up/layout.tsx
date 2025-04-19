import { TopNavBar } from "@/components/navbars/top-navbar";

export default function ClientRegistraionLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div>
      <TopNavBar />
      {/* <div className="flex flex-col items-center justify-center min-h-screen bg-primary-white dark:bg-gray-900"> */}
      <div className="flex flex-col  bg-primary-white dark:bg-gray-900">
        {children}
      </div>
    </div>
  );
}
