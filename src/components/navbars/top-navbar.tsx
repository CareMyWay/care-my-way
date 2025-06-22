"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MobileTopNav from "@/components/navbars/mobile-topnav";

import FadeTransition from "@/components/fade-transition";
import Logout from "../signup-forms/logout";

const LOGO = "/svgs/CMW_Logo.svg";
const NAVBAR_ITEMS = "text-darkest-green hover:text-medium-green font-bold ";

export function TopNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="min-w-screen">
      <div className="border-b-2 border-darkest-green mx-auto px-8">
        <div className="rounded-b-2xl md:rounded-none flex justify-between items-center px-2 md:px-10 py-5  z-30">
          <button
            type="button"
            className="md:hidden text-darkest-green hover:text-medium-green"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
          <div className="flex items-center ml-[-40px]">
            <Link href="/" className="flex items-center">
              <div className="relative w-10 h-10 mr-2 ">
                <Image
                  src={LOGO}
                  alt="Care My Way Logo"
                  width={100}
                  height={100}
                  className="mx-auto "
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 md:space-x-6 lg:space-x-18 w-full px-14 ml-[-10px]">
            <Link href="/" className={NAVBAR_ITEMS}>
              <span>Home</span>
            </Link>
            <Link href="/" className={NAVBAR_ITEMS}>
              <span className="text-nowrap">How It Works</span>
            </Link>
            <Link href="/" className={NAVBAR_ITEMS}>
              <span>Features</span>
            </Link>
            <Link href="/provider" className={NAVBAR_ITEMS}>
              {" "}
              {/* Temporary link to provider profile */}
              <span>Contact</span>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-0 ml-[-35px] lg:space-x-2">
            <Link
              href="/sign-in"
              className=" text-darkest-green hover:text-medium-green text-md font-bold w-28 h-8 rounded-btn-radius text-center align-middle py-1"
            >
              Log In
            </Link>
            <Link
              href="/sign-up"
              className=" bg-darkest-green hover:bg-medium-green text-primary-white font-bold w-28 h-8 rounded-btn-radius text-center flex items-center justify-center px-2 py-2"
            >
              Sign Up
            </Link>
          </div>
          <Logout />
        </div>
      </div>
      <FadeTransition isMenuOpen={isMenuOpen}>
        <MobileTopNav />
      </FadeTransition>
    </header>
  );
}
