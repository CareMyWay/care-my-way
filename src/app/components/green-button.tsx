import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  href: string;
}

const BUTTON_STYLE =
  "bg-dark-green rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md w-fit transition-all hover:bg-darkest-green";

const GreenButton: React.FC<ButtonPropTypes> = ({ label, href }) => {
  return (
    <Link href={href} className={BUTTON_STYLE}>
      <button className="uppercase">{label}</button>
    </Link>
  );
};

export default GreenButton;
