"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button, Divider, Flex } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Hub } from "aws-amplify/utils";
import { useTransition } from "react";
import { getErrorMessage } from "@/utils/get-error-message";

export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
  const [authCheck, setAuthCheck] = useState(isSignedIn);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  useEffect(() => {
    const hubListenerCancel = Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signedIn":
          setAuthCheck(true);
          startTransition(() => router.push("/"));
          startTransition(() => router.refresh());
          break;
        case "signedOut":
          setAuthCheck(false);
          startTransition(() => router.push("/"));
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
            <Link key={route.href} href={route.href}>
              {route.label}
            </Link>
          ))}
        </Flex>

        <Flex gap="1rem" alignItems="center">
          {authCheck ? (
            <Button
              variation="primary"
              borderRadius="2rem"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button
                variation="link"
                borderRadius="2rem"
                onClick={() => router.push("/login")}
              >
                Sign In
              </Button>
              <Button
                variation="primary"
                borderRadius="2rem"
                onClick={() => router.push("/sign-up/user")}
              >
                Sign Up
              </Button>
            </>
          )}
        </Flex>
      </Flex>
      <Divider size="small" />
    </>
  );
}
