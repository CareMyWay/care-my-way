export default function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl border border-medium-green p-6 flex flex-col items-center shadow-sm">
      <span className="text-3xl font-bold text-darkest-green mb-2">{value}</span>
      <span className="text-md text-medium-green">{label}</span>
    </div>
  );
}