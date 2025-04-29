import React from "react";
import Image from "next/image";

const LOGO = "/svgs/CMW_Logo.svg";

export const CareMyWayHeader = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center mb-10">
        <Image
          src={LOGO}
          width={8}
          height={8}
          alt="Care My Way Logo"
          className="w-8 h-8 mr-3"
        />
        <h1 className="text-2xl font-bold text-darkest-green">Care My Way</h1>
      </div>
    </div>
  );
};
