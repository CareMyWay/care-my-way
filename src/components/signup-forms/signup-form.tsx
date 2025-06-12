"use client";

import { AuthUser } from "aws-amplify/auth";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

const SignUpForm = ({ user }: { user?: AuthUser }) => {
  //redirect user to home if logged in
  useEffect(() => {
    if (user) {
      redirect("/");
    }
  });

  return null;
};

export default withAuthenticator(SignUpForm);
