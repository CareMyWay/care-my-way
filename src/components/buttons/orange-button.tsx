import React from "react";
import Link from "next/link";

interface ButtonPropTypes {
  label: string;
  href: string;
  className?: string;
}

const BUTTON_STYLE =
  "bg-primary-orange rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md w-fit transition-all hover:bg-hover-orange";

const OrangeButton: React.FC<ButtonPropTypes> = ({
  label,
  href,
  className,
}) => {
  return (
    <Link href={href} className={`${className} ${BUTTON_STYLE}`}>
      <button className="uppercase">{label}</button>
    </Link>
  );
};

export default OrangeButton;
