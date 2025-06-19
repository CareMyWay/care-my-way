"use client";
import { useState } from "react";
import Link from "next/link";
import { CareProviderNavbar } from "@/components/navbars/careprovider-navbar";

const SIDEBAR_LINKS = [
  { href: "/careprovider-dashboard", label: "Overview" },
  { href: "/careprovider-dashboard/appointments", label: "Appointments" },
  { href: "/careprovider-dashboard/profile", label: "Profile" },
  { href: "/careprovider-dashboard/messages", label: "Messages" },
];

export default function CareProviderDashboard() {
  // Example state for appointments
  const [appointments] = useState([]);

  return (
    <div className="min-h-screen bg-lightest-green flex flex-col">
      {/* Top Navbar */}
      <CareProviderNavbar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-darkest-green text-primary-white rounded-tr-3xl rounded-br-3xl py-10 px-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-10 tracking-tight">Dashboard</h2>
          <nav className="flex flex-col gap-6">
            {SIDEBAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-medium-green transition-colors font-semibold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-darkest-green mb-8">
            Welcome, [Provider Name]
          </h1>
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-darkest-green mb-4">
              Upcoming Appointments
            </h2>
            <div className="bg-primary-white rounded-2xl border border-medium-green p-6">
              {appointments.length === 0 ? (
                <p className="text-medium-green">No upcoming appointments.</p>
              ) : (
                <ul>
                  {appointments.map((appt) => (
                    <li key={appt.id}>{/* Render appointment info */}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-darkest-green mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/careprovider-dashboard/profile"
                className="bg-darkest-green hover:bg-medium-green text-primary-white font-bold px-6 py-3 rounded-btn-radius transition"
              >
                View Profile
              </Link>
              <Link
                href="/careprovider-dashboard/appointments"
                className="bg-medium-green hover:bg-darkest-green text-primary-white font-bold px-6 py-3 rounded-btn-radius transition"
              >
                Manage Appointments
              </Link>
              <Link
                href="/careprovider-dashboard/availability"
                className="bg-primary-white border border-darkest-green text-darkest-green font-bold px-6 py-3 rounded-btn-radius transition hover:bg-lightest-green"
              >
                Update Availability
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}