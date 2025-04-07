import React from "react";
import Link from "next/link";

const NAVBAR_ITEMS =
  "py-2 text-darkest-green hover:text-medium-green font-bold ";

const MobileNavbar = () => {
  return (
    <div className="absolute left-0 right-0 w-full z-50 bg-primary-white p-6 sm:p-10 rounded-b-1xl shadow-lg">
      <div className="flex flex-col ">
        <Link className={NAVBAR_ITEMS} href="/">
          Home
        </Link>
        <Link className={NAVBAR_ITEMS} href="/">
          How It Works
        </Link>
        <Link className={NAVBAR_ITEMS} href="/">
          Features
        </Link>
        <Link className={NAVBAR_ITEMS} href="/">
          Contact
        </Link>
        <div className="pt-2 border-t border-darkest-green mt-2">
          <Link className={`${NAVBAR_ITEMS} block`} href="/">
            Login
          </Link>
          <Link className={`${NAVBAR_ITEMS} block`} href="/">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
