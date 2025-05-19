"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { CMWSideBySideHeader } from "../headers/cmw-side-by-side-header";

export function LogoStepBar({ stepsCount }: { stepsCount?: number }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`bg-primary-white min-w-[520px]`}>
      <CMWSideBySideHeader />

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            {/* <Link href="/" className="flex items-center">
              <div
                className="relative w-10 h-10 mr-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Image
                  src="/svgs/CMW_Logo.svg"
                  alt="logo"
                  fill
                  className="mx-auto"
                />
              </div>
            </Link> */}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-18 w-full px-16">
            {/*<Link href="/common/home" className={`text-darkest-green `}><h5 className='mb-0'>Home</h5></Link>*/}
            {/*<Link href="/public"      className={`text-darkest-green `}><h5 className='mb-0'>How It Works</h5></Link>*/}
            {/*<Link href="/public"      className={`text-darkest-green `}><h5 className='mb-0'>Features</h5></Link>*/}
            {/*<Link href="/public"      className={`text-darkest-green `}><h5 className='mb-0'>Contact</h5></Link>*/}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {/*<Link href="/common/signin" className=" s-btn transparent-button ">Log In</Link>*/}
            {/*<Link href="/common/signup" className=" s-btn green-button ">Sign Up</Link>*/}
          </div>
        </div>
      </div>
    </header>
  );
}
