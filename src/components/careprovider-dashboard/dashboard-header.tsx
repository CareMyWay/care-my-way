export default function DashboardHeader({ providerName }: { providerName: string }) {
  return (
    <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-darkest-green">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="font-semibold text-darkest-green">Welcome, {providerName}</span>
        <div className="w-10 h-10 rounded-full bg-medium-green flex items-center justify-center text-white font-bold">
          {/* Avatar initials or image */}
          {providerName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
      </div>
    </header>
  );
}