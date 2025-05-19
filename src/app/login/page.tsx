import LoginForm from "@/components/auth/login-form";
import { LogoStepBar } from "@/components/auth/logo-step-bar";
import React from "react";

const Login = () => {
  return (
    <div>
      <LogoStepBar />
      <LoginForm />
    </div>
  );
};

export default Login;
