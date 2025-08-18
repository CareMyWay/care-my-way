"use client";

import React, { useState, useMemo } from "react";
import { AdminUserData, updateUserType, deleteUser } from "@/actions/admin/getAllUsers";
import { Search, Edit, Trash2, User, Filter } from "lucide-react";

interface UserManagementTableProps {
    initialUsers: AdminUserData[];
    canManageAdmins: boolean;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
    initialUsers,
    canManageAdmins,
}) => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [userTypeFilter, setUserTypeFilter] = useState("All");
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [newUserType, setNewUserType] = useState("");
    const [loading, setLoading] = useState<string | null>(null);

    const userTypes = ["All", "Client", "Provider", "Support", "Admin", "SuperAdmin"];

    // Filter and search users
    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const matchesSearch =
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.userType.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = userTypeFilter === "All" || user.userType === userTypeFilter;

            // If current user cannot manage admins, hide admin users
            const isAdminUser = user.userType === "Admin" || user.userType === "SuperAdmin";
            const shouldShow = canManageAdmins || !isAdminUser;

            return matchesSearch && matchesFilter && shouldShow;
        });
    }, [users, searchTerm, userTypeFilter, canManageAdmins]);

    const handleEditUserType = async (userId: string, userType: string) => {
        setLoading(userId);
        try {
            const success = await updateUserType(userId, userType);
            if (success) {
                setUsers(users.map(user =>
                    user.userId === userId ? { ...user, userType } : user
                ));
                setEditingUser(null);
            } else {
                alert("Failed to update user type. You may not have permission to perform this action.");
            }
        } catch (error) {
            console.error("Error updating user type:", error);
            alert("An error occurred while updating the user type.");
        } finally {
            setLoading(null);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        setLoading(userId);
        try {
            const success = await deleteUser(userId);
            if (success) {
                setUsers(users.filter(user => user.userId !== userId));
            } else {
                alert("Failed to delete user. You may not have permission to perform this action.");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("An error occurred while deleting the user.");
        } finally {
            setLoading(null);
        }
    };

    const startEditing = (userId: string, currentUserType: string) => {
        setEditingUser(userId);
        setNewUserType(currentUserType);
    };

    const cancelEditing = () => {
        setEditingUser(null);
        setNewUserType("");
    };

    const canEditUser = (user: AdminUserData) => {
        // Super admins can edit anyone
        if (canManageAdmins) return true;

        // Regular admins cannot edit admin users
        return user.userType !== "Admin" && user.userType !== "SuperAdmin";
    };

    const getAvailableUserTypes = (currentUserType: string) => {
        if (canManageAdmins) {
            return ["Client", "Provider", "Support", "Admin", "SuperAdmin"];
        }
        // Regular admins cannot assign admin roles
        return ["Client", "Provider", "Support"];
    };

    return (
        <div className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by email, user ID, or user type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="relative min-w-[150px]">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <select
                        value={userTypeFilter}
                        onChange={(e) => setUserTypeFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                        {userTypes.map((type) => (
                            <option key={type} value={type}>
                                {type === "All" ? "All Users" : type}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <User className="text-blue-600" size={24} />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
                        </div>
                    </div>
                </div>
                {["Client", "Provider", "Support"].map((type) => (
                    <div key={type} className="bg-gray-50 p-4 rounded-lg">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">{type}s</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {filteredUsers.filter(user => user.userType === type).length}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users Table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User className="text-gray-600" size={20} />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.userId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingUser === user.userId ? (
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={newUserType}
                                                    onChange={(e) => setNewUserType(e.target.value)}
                                                    className="text-sm border border-gray-300 rounded px-2 py-1"
                                                    disabled={loading === user.userId}
                                                >
                                                    {getAvailableUserTypes(user.userType).map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleEditUserType(user.userId, newUserType)}
                                                    disabled={loading === user.userId}
                                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    disabled={loading === user.userId}
                                                    className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.userType === "SuperAdmin" ? "bg-purple-100 text-purple-800" :
                                                user.userType === "Admin" ? "bg-red-100 text-red-800" :
                                                    user.userType === "Provider" ? "bg-blue-100 text-blue-800" :
                                                        user.userType === "Support" ? "bg-yellow-100 text-yellow-800" :
                                                            "bg-green-100 text-green-800"
                                                }`}>
                                                {user.userType}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            {canEditUser(user) && (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(user.userId, user.userType)}
                                                        disabled={loading === user.userId || editingUser === user.userId}
                                                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                                                        title="Edit user type"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.userId)}
                                                        disabled={loading === user.userId}
                                                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {loading === user.userId && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No users found matching your search criteria.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementTable;
