"use client";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import React from "react";

import { handleSignOut } from "@/actions/cognitoActions";

const LogoutForm = () => {
  const router = useRouter();
  return (
    <form action={handleSignOut}>
      <button>Logout</button>
    </form>
  );
};

export default LogoutForm;
