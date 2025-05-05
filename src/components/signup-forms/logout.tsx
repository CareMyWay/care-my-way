"use client";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Logout = () => {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/sign-up");
      }}
      className="px-2 bg-white text-black"
    >
      Logout
    </button>
  );
};

export default Logout;
