import { SignUpHalfCard_needCG } from "@/components/signup/sign-up-half-card-need-cg";
import { SignUpHalfCard_asCG } from "@/components/signup/sign-up-half-card-as-a-cg";
import Link from "next/link";
import type React from "react";
import Image from "next/image";

export default function SignUpStep2({ voidNext }: { voidNext?: () => void }) {
  return (
    <>
      <div className="flex flex-row w-full justify-center mt-32">
        <h6>Sign up to Care My Way</h6>
      </div>
      <div className="flex flex-col w-full justify-center items-center gap-6">
        <div className="space-y-5 w-[458px]">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-darkest-green">
              Full Name
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your full name here"
              className="std-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-darkest-green">
              Email address
            </label>
            <input
              id="email"
              type="text"
              placeholder="Enter your Email here"
              className="std-input"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="block text-darkest-green">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your Password here"
              className="std-input"
            />
          </div>

          <button
            type="submit"
            className=" m-btn orange-button mt-12 "
            onClick={voidNext}
          >
            SIGN UP
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">— OR —</p>

          <div className="flex justify-center gap-4 mt-4">
            <button className=" transparent-button m-btn gap-2 border-1 border-gray-400">
              <Image
                src="/svgs/icon-google.svg"
                alt="Sign up with Google Button"
                width={24}
                height={24}
              />
              Sign up with Google
            </button>

            <button className=" transparent-button m-btn gap-2 border-1 border-gray-400">
              <Image
                src="/svgs/icon-apple-black.svg"
                alt="Sign up with Apple Button"
                width={24}
                height={24}
              />
              Sign up with Apple
            </button>
          </div>

          <div className="mt-6">
            <h6>
              Already have an account? &nbsp;
              <Link href="/common/signin" className="underline">
                Sign In
              </Link>
            </h6>
          </div>
        </div>
      </div>
    </>
  );
}
