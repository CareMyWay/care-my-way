import UserManagementTable from "@/components/admin-dashboard-ui/user-management-table";
import { getAllUsers } from "@/actions/admin/getAllUsers";

export default async function AdminDashboardPage() {
  const usersData = await getAllUsers();

  if (!usersData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        <div className="text-red-600">Failed to load users. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <UserManagementTable
        initialUsers={usersData.users}
        canManageAdmins={usersData.canManageAdmins}
      />
    </div>
  );
}
