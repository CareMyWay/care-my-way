// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// import { redirect, useRouter } from "next/navigation";
// import { Button, Divider, Flex } from "@aws-amplify/ui-react";
// import { getCurrentUser, signOut } from "@aws-amplify/auth";

// import { Hub } from "aws-amplify/utils";
// import { useTransition } from "react";
// import { getErrorMessage } from "@/utils/get-error-message";
// import { Menu, X } from "lucide-react"; // for hamburger icon

// import GreenButton from "../buttons/green-button";

// // export default function NavBar({ isSignedIn }: { isSignedIn: boolean }) {
// export default function NavBar() {
//   const [authCheck, setAuthCheck] = useState<boolean | null>(null);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [, startTransition] = useTransition();
//   const router = useRouter();

//   useEffect(() => {
//     // Check current user on mount
//     getCurrentUser()
//       .then(() => setAuthCheck(true))
//       .catch(() => setAuthCheck(false));
//     // Listen to auth events

//     const hubListenerCancel = Hub.listen("auth", (data) => {
//       switch (data.payload.event) {
//         case "signedIn":
//           setAuthCheck(true);
//           startTransition(() => router.refresh());
//           break;
//         case "signedOut":
//           setAuthCheck(false);
//           startTransition(() => router.refresh());
//           break;
//       }
//     });

//     return () => hubListenerCancel();
//   }, [router]);

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//     } catch (error) {
//       console.log(getErrorMessage(error));
//     }
//     redirect("/login");
//   };

//   const defaultRoutes = [
//     { href: "/", label: "Home" },
//     { href: "/marketplace", label: "Healthcare Directory" },
//     { href: "/provider-dashboard", label: "Dashboard", loggedIn: true },
//   ];

//   const routes = defaultRoutes.filter(
//     (route) => route.loggedIn === authCheck || route.loggedIn === undefined
//   );

//   return (
//     <>
//       <nav className="w-full px-4 py-3 flex justify-between items-center border-b border-gray-200">
//         <div className="text-lg font-semibold text-darkest-green">
//           Care My Way
//         </div>

//         {/* Hamburger Button - Mobile Only */}
//         <button
//           className="lg:hidden text-darkest-green"
//           onClick={() => setMenuOpen(!menuOpen)}
//           aria-label="Toggle menu"
//         >
//           {menuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//         <Flex
//           direction="row"
//           justifyContent="space-between"
//           alignItems="center"
//           padding="1rem"
//         >
//           <Flex as="nav" alignItems="center" gap="3rem" margin="0 2rem">
//             {routes.map((route) => (
//               <Link
//                 className="text-darkest-green"
//                 key={route.href}
//                 href={route.href}
//               >
//                 {route.label}
//               </Link>
//             ))}
//           </Flex>

//           <Flex gap="1rem" alignItems="center">
//             {authCheck ? (
//               <GreenButton variant="action" onClick={handleSignOut}>
//                 Sign Out
//               </GreenButton>
//             ) : (
//               <>
//                 <Button
//                   variation="link"
//                   style={{ color: "#173F3F", textTransform: "uppercase" }}
//                   borderRadius="2rem"
//                   onClick={() => router.push("/login")}
//                 >
//                   Log In
//                 </Button>

//                 <GreenButton
//                   variant="action"
//                   onClick={() => router.push("/sign-up/user")}
//                 >
//                   Sign Up
//                 </GreenButton>
//               </>
//             )}
//           </Flex>
//         </Flex>
//         <Divider size="small" />
//       </nav>
//     </>
//   );
// }
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
import { Menu, X } from "lucide-react"; // for hamburger icon

export default function NavBar() {
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
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Healthcare Directory" },
    { href: "/provider-dashboard", label: "My Dashboard", loggedIn: true },
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
