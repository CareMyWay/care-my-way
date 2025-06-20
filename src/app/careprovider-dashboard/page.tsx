import DashboardSidebar from "@/components/careprovider-dashboard/careprovider-sidenav";
import DashboardHeader from "@/components/careprovider-dashboard/dashboard-header";
import StatCard from "@/components/careprovider-dashboard/stat-card";
import AppointmentsTable from "@/components/careprovider-dashboard/appointment-table";

export default function CareProviderDashboard() {
  const providerName = "Jane Doe";
  const stats = [
    { label: "Upcoming Appointments", value: 2 },
    { label: "Completed Visits", value: 18 },
    { label: "Messages", value: 5 },
  ];
  const appointments = [
    { id: 1, client: "Jane Doe", date: "2025-06-20", time: "10:00 AM" },
    { id: 2, client: "John Smith", date: "2025-06-22", time: "2:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-lightest-green flex">
      <DashboardSidebar />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col">
        <DashboardHeader providerName={providerName} />
        <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </section>
        <section className="px-6 pb-6">
          <h2 className="text-xl font-semibold text-darkest-green mb-4">Upcoming Appointments</h2>
          <div className="bg-white rounded-2xl border border-medium-green p-6">
            <AppointmentsTable appointments={appointments} />
          </div>
        </section>
      </div>
    </div>
  );
}