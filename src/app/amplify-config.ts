"use client";

import type { ResourcesConfig } from "aws-amplify";
import { Amplify } from "aws-amplify";

import amplifyconfig from "@/../amplify_outputs.json";

Amplify.configure(amplifyconfig as ResourcesConfig, { ssr: true });
