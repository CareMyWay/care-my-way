import UserManagementTable from "@/components/admin-dashboard-ui/user-management-table";
import { getAllUsers } from "@/actions/admin/getAllUsers";
import { User } from "lucide-react";

export default async function AdminDashboardPage() {
  const usersData = await getAllUsers();

  if (!usersData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl border-2 border-light-green p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-darkest-green mb-2">Admin Dashboard</h1>
          <p className="text-medium-green text-sm">
            Manage and monitor all users in the system
          </p>
        </div>
        <div className="bg-white rounded-xl border-2 border-red-200 p-6 shadow-sm">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Users</h3>
            <p className="text-red-600">Please try refreshing the page or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border-2 border-light-green p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-darkest-green mb-2">User Management</h1>
        <p className="text-medium-green text-sm">
          Manage and monitor all users in the system
        </p>
      </div>

      <UserManagementTable
        initialUsers={usersData.users}
        canManageAdmins={usersData.canManageAdmins}
      />
    </div>
  );
}
