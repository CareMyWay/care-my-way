import Link from "next/link";
import { Calendar, User, MessageSquare, LogOut } from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/careprovider-dashboard", label: "Dashboard", icon: <Calendar size={20} /> },
  { href: "/careprovider-dashboard/appointments", label: "Appointments", icon: <Calendar size={20} /> },
  { href: "/careprovider-dashboard/profile", label: "Profile", icon: <User size={20} /> },
  { href: "/careprovider-dashboard/messages", label: "Messages", icon: <MessageSquare size={20} /> },
];

export default function DashboardSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-darkest-green text-primary-white py-8 px-6">
      <div className="mb-10 flex items-center gap-2">
        <span className="text-2xl font-extrabold tracking-tight">CareMyWay</span>
      </div>
      <nav className="flex flex-col gap-4">
        {SIDEBAR_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-medium-green/30 transition"
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-10">
        <button className="flex items-center gap-2 text-primary-white hover:text-medium-green transition">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}