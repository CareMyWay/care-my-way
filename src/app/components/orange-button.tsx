import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  href: string;
}

const BUTTON_STYLE =
  "bg-primary-orange rounded-btn-radius font-btn-font-wgt text-primary-white px-6 py-3 md:text-btn-font-size text-[14px] shadow-md w-fit transition-all hover:bg-hover-orange";

const OrangeButton: React.FC<ButtonPropTypes> = ({ label, href }) => {
  return (
    <Link href={href} className={BUTTON_STYLE}>
      <button className="uppercase">{label}</button>
    </Link>
  );
};

export default OrangeButton;
