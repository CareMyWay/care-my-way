"use client";
import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/../../amplify_outputs.json";

Amplify.configure(outputs);

const Auth = ({ children }: { children: React.ReactNode }) => {
  return <Authenticator.Provider>{children}</Authenticator.Provider>;
};

export default Auth;
