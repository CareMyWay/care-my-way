"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Divider } from "@aws-amplify/ui-react";
import { getCurrentUser, signOut } from "@aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useTransition } from "react";
import { getErrorMessage } from "@/utils/get-error-message";
import GreenButton from "../buttons/green-button";
import { Menu, X } from "lucide-react"; // for hamburger icon

type NavBarProps = {
  userGroups: string[];
};

const defaultSharedRoutes = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Healthcare Directory" },
];

const roleRoutesMap: Record<
  string,
  { href: string; label: string; loggedIn: boolean }[]
> = {
  Admin: [{ href: "/admin-dashboard", label: "My Dashboard", loggedIn: true }],
  // Provider: [
  //   { href: "/provider-dashboard", label: "My Dashboard", loggedIn: true },
  // ],
  Client: [
    { href: "/client-dashboard", label: "My Dashboard", loggedIn: true },
    { href: "/client-dashboard/profile", label: "My Profile", loggedIn: true },
  ],
  Support: [
    { href: "/support-dashboard", label: "Support Dashboard", loggedIn: true },
  ],
};

export default function NavBar({ userGroups = [] }: NavBarProps) {
  const [authCheck, setAuthCheck] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle
  const [, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(() => setAuthCheck(true))
      .catch(() => setAuthCheck(false));

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
    router.push("/login");
  };

  // Gather unique routes from roles
  const roleBasedRoutes = Array.from(
    new Map(
      (userGroups ?? [])
        .flatMap((group) => roleRoutesMap[group] || [])
        .map((route) => [route.href, route]) // use href as key
    ).values()
  );
  console.log("Role-based routes:", roleBasedRoutes);

  const combinedRoutes = [...defaultSharedRoutes, ...roleBasedRoutes];

  const renderRoutes = (routes: typeof combinedRoutes) =>
    routes.map(({ href, label }) => (
      <Link key={href} href={href} className="text-darkest-green">
        {label}
      </Link>
    ));

  return (
    <>
      <nav className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200">
        {/* Left: Logo + Links */}
        <div className="flex items-center gap-8">
          <div className="text-lg font-semibold text-darkest-green">
            Care My Way
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {/* {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="text-darkest-green"
              >
                {route.label}
              </Link>
            ))} */}
            {renderRoutes(combinedRoutes)}
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
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
        </div>

        {/* Hamburger Icon - Mobile Only */}
        <button
          className="lg:hidden text-darkest-green"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden px-4 py-4 space-y-4 bg-white border-b border-gray-200">
          {/* {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="block text-darkest-green"
              onClick={() => setMenuOpen(false)}
            >
              {route.label}
            </Link>
          ))} */}
          {renderRoutes(combinedRoutes)}

          <div className="my-4 border-t-2 border-darkest-green w-full" />

          {authCheck ? (
            <GreenButton variant="action" onClick={handleSignOut}>
              Sign Out
            </GreenButton>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                variation="link"
                style={{
                  color: "#173F3F",
                  border: "2px solid #173F3F",
                  padding: "8px 16px",
                  borderRadius: "2rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  backgroundColor: "transparent",
                }}
                borderRadius="2rem"
                onClick={() => {
                  router.push("/login");
                  setMenuOpen(false);
                }}
              >
                Log In
              </Button>
              <GreenButton
                variant="action"
                onClick={() => {
                  router.push("/sign-up/user");
                  setMenuOpen(false);
                }}
              >
                Sign Up
              </GreenButton>
            </div>
          )}
        </div>
      )}

      <Divider size="small" />
    </>
  );
}
