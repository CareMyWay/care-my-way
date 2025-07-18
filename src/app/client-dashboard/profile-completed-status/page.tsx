"use client";

import Link from "next/link";

export default function ProfileCompletedStatusPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="p-4 rounded-lg  text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-darkest-green mb-4">
          🎉 Profile Completed!
        </h1>
        <p className="text-gray-600 mb-6">
          Thank you for completing your profile. You can now view and manage
          your profile information.
        </p>
        <Link
          href="/client-dashboard/profile"
          className="px-5 py-2 bg-dark-green text-white rounded-md hover:bg-primary-orange transition"
        >
          Go to Profile
        </Link>
      </div>
    </div>
  );
}
