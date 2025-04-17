import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface ButtonPropTypes {
  label: string;
  href: string;
  className?: string;
}

const BUTTON_STYLE =
  "bg-primary-orange rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md transition-all hover:bg-hover-orange uppercase inline-block";

const OrangeButton: React.FC<ButtonPropTypes> = ({
  label,
  href,
  className,
}) => {
  return (
    <Link href={href} className={clsx(BUTTON_STYLE, className)}>
      {label}
    </Link>
  );
};

export default OrangeButton;
