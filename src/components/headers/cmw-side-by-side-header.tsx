import React from "react";
import Image from "next/image";

const LOGO = "/svgs/CMW_Logo.svg";
import Link from "next/link";

export const CMWSideBySideHeader = () => {
  return (
    <div className="container mx-auto px-10 py-4 ">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-center">
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src="/svgs/CMW_Logo.svg"
                alt="logo"
                fill
                className="mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-darkest-green">
              Care My Way
            </h1>
          </Link>
        </div>
      </div>
    </div>
  );
};
