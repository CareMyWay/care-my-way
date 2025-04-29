"use client";

import Link from "next/link";
import Image from "next/image";
import OrangeButton from "@/components/buttons/orange-button";

const LOGO = "/svgs/CMW_Logo.svg";
const INPUT_STYLES =
  "w-full rounded-[5px] bg-primary-white border border-[#B5BAC0] h-12 px-4 focus:outline-none focus:ring-1 focus:ring-dark-green";
const ALT_SIGNIN_BTN =
  "flex items-center gap-2 rounded-md px-4 py-2 border border-[#B5BAC0] hover:border-black transition-all text-sm";

export default function SignUpForm() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-white px-4 my-14 mt-6 md:mt-10">
      <div className="max-w-3xl">
        <Image
          src={LOGO}
          alt="Care My Way Logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <div className="border border-[#B5BAC0] rounded-md p-8 py-12 shadow-md bg-primary-white">
          <h2 className="text-2xl font-bold text-darkest-green text-center mb-10">
            Welcome to Care My Way!
          </h2>
          <form>
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  id="firstName"
                  type="firstName"
                  name="firstName"
                  placeholder="First Name"
                  className={INPUT_STYLES}
                />
              </div>
              <div className="space-y-2">
                <input
                  id="lastName"
                  type="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  className={INPUT_STYLES}
                />
              </div>
              <div className="space-y-2">
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={INPUT_STYLES}
                />
              </div>

              <div className="space-y-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={INPUT_STYLES}
                />
              </div>
            </div>

            <div className="mt-6 text-center ">
              <OrangeButton
                href="/client/sign-up/create-account"
                variant="action"
                type="submit"
                label="Continue"
                className="self-center mb-6 w-full"
              />
              <p className="text-gray-500 text-sm">— OR —</p>

              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                {/* Google Button */}
                <button className={ALT_SIGNIN_BTN}>
                  {/* Google icon */}
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                {/* Apple Button */}
                <button className={ALT_SIGNIN_BTN}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-3.405 1.88-2.87 6.75.572 8.65z"
                      fill="#000"
                    />
                  </svg>
                  Continue with Apple
                </button>
              </div>

              <div className="mt-6">
                Already have an account?
                <Link
                  href="/login"
                  className="text-darkest-green font-bold hover:cursor-pointer hover:text-medium-green transition-all mx-1"
                >
                  Log In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
