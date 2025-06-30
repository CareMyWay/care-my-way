import LoginForm from "@/components/auth/login-form";
import { CMWSideBySideHeader } from "@/components/headers/cmw-side-by-side-header";
import React from "react";

const Login = () => {
  return (
    <div>
      <CMWSideBySideHeader />
      <LoginForm />
    </div>
  );
};

export default Login;
