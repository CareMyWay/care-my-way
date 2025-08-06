"use client";

import type { ResourcesConfig } from "aws-amplify";
import { Amplify } from "aws-amplify";

import amplifyconfig from "@/../amplify_outputs.json";

// Configure Amplify with SSR support
Amplify.configure(amplifyconfig as ResourcesConfig, { 
  ssr: true
});

export default function ConfigureAmplifyClientSide() {
  return null;
}
