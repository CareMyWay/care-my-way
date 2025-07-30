import React from "react";
import Link from "next/link";

export default function ProfileNotComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center text-darkest-green">
      <div className="text-center ">
        <h1 className="text-4xl font-bold py-1">Profile Not Completed.</h1>
        <p className=" text-2xl py-4">
          You must complete your profile to book Healthcare Providers and/or
          take the Healthcare Transition Quiz.
        </p>
        <div className="my-4">
          <Link
            href="/client-dashboard/to-dos/complete-profile"
            className="px-5 py-3 bg-dark-green text-xl text-white rounded-md hover:bg-primary-orange transition"
          >
            Complete Profile Now
          </Link>
        </div>
      </div>
    </div>
  );
}
