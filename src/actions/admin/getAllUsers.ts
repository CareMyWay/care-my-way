"use server";

import { cookieBasedClient } from "@/utils/amplify-server-utils";
import { checkIsAdmin, checkIsSuperAdmin } from "@/utils/amplify-server-utils";
import { redirect } from "next/navigation";

export interface AdminUserData {
    id: string;
    userId: string;
    email: string;
    userType: string;
    profileOwner: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AdminAllUsersResponse {
    users: AdminUserData[];
    canManageAdmins: boolean;
}

export async function getAllUsers(): Promise<AdminAllUsersResponse | null> {
    // Check if user is admin
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        redirect("/not-found");
    }

    // Check if user is super admin (can manage other admins)
    const isSuperAdmin = await checkIsSuperAdmin();

    try {
        const { data, errors } = await cookieBasedClient.models.UserProfile.list({
            authMode: "userPool",
        });

        if (errors) {
            console.error("Error fetching users:", errors);
            return null;
        }

        const users: AdminUserData[] = data.map((user) => ({
            id: user.id,
            userId: user.userId,
            email: user.email || "",
            userType: user.userType || "Client",
            profileOwner: user.profileOwner || "",
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        return {
            users,
            canManageAdmins: isSuperAdmin,
        };
    } catch (error) {
        console.error("Failed to get users:", error);
        return null;
    }
}

export async function updateUserType(userId: string, newUserType: string): Promise<boolean> {
    // Check if user is admin
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        return false;
    }

    // Check if user is super admin (can manage other admins)
    const isSuperAdmin = await checkIsSuperAdmin();

    // If trying to update an admin user, must be super admin
    if ((newUserType === "Admin" || newUserType === "SuperAdmin") && !isSuperAdmin) {
        return false;
    }

    try {
        // First, find the user record by userId
        const { data: userRecords, errors: findErrors } = await cookieBasedClient.models.UserProfile.list({
            filter: { userId: { eq: userId } },
            authMode: "userPool",
        });

        if (findErrors || !userRecords || userRecords.length === 0) {
            console.error("Error finding user:", findErrors);
            return false;
        }

        const userRecord = userRecords[0];

        // Check if current user type is admin and current user is not super admin
        if ((userRecord.userType === "Admin" || userRecord.userType === "SuperAdmin") && !isSuperAdmin) {
            return false;
        }

        // Update the user record
        const { errors: updateErrors } = await cookieBasedClient.models.UserProfile.update({
            id: userRecord.id,
            userType: newUserType,
        });

        if (updateErrors) {
            console.error("Error updating user:", updateErrors);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Failed to update user type:", error);
        return false;
    }
}

export async function deleteUser(userId: string): Promise<boolean> {
    // Check if user is admin
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        return false;
    }

    // Check if user is super admin (can manage other admins)
    const isSuperAdmin = await checkIsSuperAdmin();

    try {
        // First, find the user record by userId
        const { data: userRecords, errors: findErrors } = await cookieBasedClient.models.UserProfile.list({
            filter: { userId: { eq: userId } },
            authMode: "userPool",
        });

        if (findErrors || !userRecords || userRecords.length === 0) {
            console.error("Error finding user:", findErrors);
            return false;
        }

        const userRecord = userRecords[0];

        // Check if current user type is admin and current user is not super admin
        if ((userRecord.userType === "Admin" || userRecord.userType === "SuperAdmin") && !isSuperAdmin) {
            return false;
        }

        // Delete the user record
        const { errors: deleteErrors } = await cookieBasedClient.models.UserProfile.delete({
            id: userRecord.id,
        });

        if (deleteErrors) {
            console.error("Error deleting user:", deleteErrors);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Failed to delete user:", error);
        return false;
    }
}
