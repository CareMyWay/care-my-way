"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { getCurrentUser, signOut } from "@aws-amplify/auth";

import { Hub } from "aws-amplify/utils";
import { useTransition } from "react";
import { getErrorMessage } from "@/utils/get-error-message";
import GreenButton from "../buttons/green-button";

// export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
export default function NavBar() {
  const [authCheck, setAuthCheck] = useState<boolean | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // Check current user on mount
    getCurrentUser()
      .then(() => setAuthCheck(true))
      .catch(() => setAuthCheck(false));
    // Listen to auth events

    const hubListenerCancel = Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signedIn":
          setAuthCheck(true);
          startTransition(() => router.refresh());
          break;
        case "signedOut":
          setAuthCheck(false);
          startTransition(() => router.refresh());
          break;
      }
    });

    return () => hubListenerCancel();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(getErrorMessage(error));
    }
    redirect("/login");
  };

  const defaultRoutes = [
    { href: "/", label: "Home" },
    { href: "/add", label: "Add Title", loggedIn: true },
  ];

  const routes = defaultRoutes.filter(
    (route) => route.loggedIn === authCheck || route.loggedIn === undefined
  );

  return (
    <>
      <Flex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        padding="1rem"
      >
        <Flex as="nav" alignItems="center" gap="3rem" margin="0 2rem">
          {routes.map((route) => (
            <Link
              className="text-darkest-green"
              key={route.href}
              href={route.href}
            >
              {route.label}
            </Link>
          ))}
        </Flex>

        <Flex gap="1rem" alignItems="center">
          {authCheck ? (
            <GreenButton variant="action" onClick={handleSignOut}>
              Sign Out
            </GreenButton>
          ) : (
            <>
              <Button
                variation="link"
                style={{ color: "#173F3F", textTransform: "uppercase" }}
                borderRadius="2rem"
                onClick={() => router.push("/login")}
              >
                Log In
              </Button>

              <GreenButton
                variant="action"
                onClick={() => router.push("/sign-up/user")}
              >
                Sign Up
              </GreenButton>
            </>
          )}
        </Flex>
      </Flex>
      <Divider size="small" />
    </>
  );
}
