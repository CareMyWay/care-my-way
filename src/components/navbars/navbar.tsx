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

<<<<<<< HEAD
export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
  const [authCheck, setAuthCheck] = useState(isSignedIn);
  const [isPending, startTransition] = useTransition();
  const [showLoading, setShowLoading] = useState(false);
  const router = useRouter(); // <-- Move useRouter to top level

  useEffect(() => {
    setShowLoading(isPending);
  }, [isPending]);

<<<<<<< HEAD
=======
=======
// export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
export default function NavBar() {
  const [authCheck, setAuthCheck] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();
>>>>>>> 2633be0 (Refactor Navbar)
  const router = useRouter();

>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
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

<<<<<<< HEAD
  const handleLoading = () => {
    if (showLoading) {
      return (
        <div className="loading-indicator">
          <span>Loading...</span>
        </div>
      );
    }
    return null;
  };
  const loadingIndicator = handleLoading();

  if (loadingIndicator) {
    return loadingIndicator;
  }

  const signOutSignIn = async () => {
    if (authCheck) {
      await signOut();
    } else {
      router.push("/signin");
    }
=======
  const handleSignOut = async () => {
<<<<<<< HEAD
    await signOut();
>>>>>>> 1b87dd5 (Complete navbar with auth functionality)
=======
    try {
      await signOut();
    } catch (error) {
      console.log(getErrorMessage(error));
    }
<<<<<<< HEAD
    redirect("/auth/sign-in");
>>>>>>> c523b7f (Complete sign up, sign in, and logout with authentication)
=======
    redirect("/login");
>>>>>>> 1a1f036 (Clean up routing for sign up)
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
