import React from "react";
import Image from "next/image";

const LOGO = "/svgs/CMW_Logo.svg";

type CMWStackedHeaderProps = {
  title?: string;
};

const CMWStackedHeader: React.FC<CMWStackedHeaderProps> = ({ title }) => {
  return (
    <div>
      <Image
        src={LOGO}
        alt="Care My Way Logo"
        width={80}
        height={80}
        className="mx-auto mb-4 h-auto w-20"
      />
      <h2 className="text-h4-size font-bold text-darkest-green text-center ">
        {title}
      </h2>
    </div>
  );
};

export default CMWStackedHeader;
