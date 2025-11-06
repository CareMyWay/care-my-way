"use client";
import React from "react";
import { Amplify } from "aws-amplify";
import config from "@/../amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

Amplify.configure(config, { ssr: true });

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Authenticator.Provider>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
      >
        {children}
      </GoogleReCaptchaProvider>
    </Authenticator.Provider>
  );
};

export default AuthProvider;
