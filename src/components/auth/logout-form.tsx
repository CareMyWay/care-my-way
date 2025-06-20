"use client";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

import { handleSignOut } from "@/actions/cognitoActions";

const LogoutForm = () => {
  const router = useRouter();
  return (
    <form action={handleSignOut}>
      <button
      // onClick={async () => {
      //   await signOut();
      //   router.push("/sign-up");
      // }}
      // className="px-2 bg-white text-black"
      >
        Logout
      </button>
    </form>
  );
};

export default LogoutForm;
