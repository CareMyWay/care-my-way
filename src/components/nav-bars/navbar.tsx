"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, redirect } from "next/navigation";
import { Button, Divider } from "@aws-amplify/ui-react";
import { getCurrentUser, signOut } from "@aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useTransition } from "react";
import { getErrorMessage } from "@/utils/get-error-message";
import GreenButton from "../buttons/green-button";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "@/components/language-switch/LanguageSwhitcher";
import {useTranslation} from "react-i18next"; // for hamburger icon

export default function NavBar() {
  const { t } = useTranslation();
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
    redirect("/login");
  };

  const defaultRoutes = [
    { href: "/", label: t("Home") },
    { href: "/marketplace", label: t("Healthcare Directory") },
    { href: "/client-dashboard", label: t("My Dashboard"), loggedIn: true },
    // { href: "/settings", label: "Settings", loggedIn: true },
  ];

  const routes = defaultRoutes.filter(
    (route) => route.loggedIn === authCheck || route.loggedIn === undefined
  );

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
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className="text-darkest-green"
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher    />
          {authCheck ? (
            <GreenButton className={"whitespace-nowrap"} variant="action" onClick={handleSignOut}>
              {t("Sign Out")}
            </GreenButton>
          ) : (
            <>
              <Button
                variation="link"
                style={{ color: "#173F3F", textTransform: "uppercase", whiteSpace: "nowrap" }}
                borderRadius="2rem"
                onClick={() => router.push("/login")}
              >
                Log In
              </Button>
              <GreenButton
                className={"whitespace-nowrap"}
                variant="action"
                onClick={() => router.push("/sign-up/user")}
              >
                {t("Sign Up")}
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
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="block text-darkest-green"
              onClick={() => setMenuOpen(false)}
            >
              {route.label}
            </Link>
          ))}
          <div className="my-4 border-t-2 border-darkest-green w-full" />
          <LanguageSwitcher    />
          {authCheck ? (
            <GreenButton variant="action" onClick={handleSignOut} className={"whitespace-nowrap"}>
              {t("Sign Out")}
            </GreenButton>
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                variation="link"
                className={"whitespace-nowrap"}
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
                {t("Log In")}
              </Button>
              <GreenButton
                className={"whitespace-nowrap"}
                variant="action"
                onClick={() => {
                  router.push("/sign-up/user");
                  setMenuOpen(false);
                }}
              >
                {t("Sign Up")}
              </GreenButton>
            </div>
          )}
        </div>
      )}

      <Divider size="small" />
    </>
  );
}
