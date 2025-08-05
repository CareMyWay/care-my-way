import React from "react";
import Link from "next/link";

export default function ProfileNotComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="p-4 rounded-lg  text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-darkest-green mb-4">
          Profile Not Completed.
        </h1>
        <p className="text-gray-600 mb-6">
          You must complete your profile before booking Healthcare Providers
          and/or taking the Healthcare Transition Quiz.
        </p>
        <Link
          href="/client-dashboard/to-dos/complete-profile"
          className="px-5 py-2 bg-dark-green text-white rounded-md hover:bg-primary-orange transition"
        >
          Complete Profile Now
        </Link>
      </div>
    </div>
  );
}
