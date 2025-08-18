"use client";

import React, { useState, useMemo } from "react";
import { AdminUserData, updateUserType, deleteUser } from "@/actions/admin/getAllUsers";
import { Search, Edit, Trash2, User, Filter, Users, UserCheck, UserX } from "lucide-react";
import UserProfilePicture from "./user-profile-picture";

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
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
            const matchesSearch =
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

    const getUserTypeColor = (userType: string) => {
        switch (userType) {
            case "SuperAdmin":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "Admin":
                return "bg-red-100 text-red-800 border-red-200";
            case "Provider":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Support":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            default:
                return "bg-green-100 text-green-800 border-green-200";
        }
    };

    return (
        <div className="space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl border-2 border-light-green p-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medium-green" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or user type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-light-green rounded-lg focus:border-medium-green focus:outline-none transition-colors duration-200 text-dark-green placeholder-medium-green"
                        />
                    </div>
                    <div className="relative min-w-[180px]">
                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-medium-green" size={20} />
                        <select
                            value={userTypeFilter}
                            onChange={(e) => setUserTypeFilter(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-light-green rounded-lg focus:border-medium-green focus:outline-none appearance-none bg-white transition-colors duration-200 text-dark-green"
                        >
                            {userTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type === "All" ? "All Users" : type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border-2 border-light-green p-6 shadow-sm">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-darkest-green rounded-lg flex items-center justify-center">
                            <Users className="text-white" size={24} />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-medium-green">Total Users</p>
                            <p className="text-2xl font-bold text-darkest-green">{filteredUsers.length}</p>
                        </div>
                    </div>
                </div>

                {["Client", "Provider", "Support"].map((type) => {
                    const count = filteredUsers.filter(user => user.userType === type).length;
                    const icon = type === "Client" ? UserCheck : type === "Provider" ? User : UserX;
                    const IconComponent = icon;

                    return (
                        <div key={type} className="bg-white rounded-xl border-2 border-light-green p-6 shadow-sm">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-medium-green rounded-lg flex items-center justify-center">
                                    <IconComponent className="text-white" size={24} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-medium-green">{type}s</p>
                                    <p className="text-2xl font-bold text-darkest-green">{count}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border-2 border-light-green shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-light-green">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-darkest-green">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-darkest-green">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-darkest-green">
                                    User Type
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-darkest-green">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-darkest-green">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-light-green">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <UserProfilePicture
                                                profilePhoto={user.profilePhoto}
                                                firstName={user.firstName}
                                                lastName={user.lastName}
                                                size="md"
                                            />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-darkest-green">
                                                    {user.firstName && user.lastName
                                                        ? `${user.firstName} ${user.lastName}`
                                                        : user.firstName || user.lastName || "N/A"
                                                    }
                                                </div>
                                                {(user.firstName || user.lastName) && (
                                                    <div className="text-xs text-medium-green">{user.userId}</div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-dark-green">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingUser === user.userId ? (
                                            <div className="flex items-center space-x-2">
                                                <select
                                                    value={newUserType}
                                                    onChange={(e) => setNewUserType(e.target.value)}
                                                    className="text-sm border-2 border-light-green rounded-lg px-3 py-1 focus:border-medium-green focus:outline-none"
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
                                                    className="text-xs bg-darkest-green text-white px-3 py-1 rounded-lg hover:bg-dark-green transition-colors duration-200 disabled:opacity-50"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    disabled={loading === user.userId}
                                                    className="text-xs bg-medium-green text-white px-3 py-1 rounded-lg hover:bg-dark-green transition-colors duration-200 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getUserTypeColor(user.userType)}`}>
                                                {user.userType}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-medium-green">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            {canEditUser(user) && (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(user.userId, user.userType)}
                                                        disabled={loading === user.userId || editingUser === user.userId}
                                                        className="text-medium-green hover:text-dark-green transition-colors duration-200 disabled:opacity-50"
                                                        title="Edit user type"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.userId)}
                                                        disabled={loading === user.userId}
                                                        className="text-primary-orange hover:text-hover-orange transition-colors duration-200 disabled:opacity-50"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                            {loading === user.userId && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-medium-green border-t-transparent"></div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-medium-green">
                        <Users className="h-12 w-12 mx-auto mb-4 text-light-green" />
                        <p className="text-lg font-medium">No users found</p>
                        <p className="text-sm">Try adjusting your search criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagementTable;