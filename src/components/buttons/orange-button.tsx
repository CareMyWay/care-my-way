import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface BaseProps {
  className?: string;
}

// Route variant
interface RouteButtonProps extends BaseProps {
  variant: "route";
  href: string;
  children: React.ReactNode;
}

// Action variant
interface ActionButtonProps
  extends BaseProps,
  React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "action";
  children: React.ReactNode;
}

type ButtonPropTypes = RouteButtonProps | ActionButtonProps;

const BUTTON_STYLE =
  "cursor-pointer text-center bg-primary-orange rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md transition-all hover:bg-hover-orange uppercase inline-block";

const OrangeButton: React.FC<ButtonPropTypes> = (props) => {
  const extraStyles = clsx(BUTTON_STYLE, props.className);

  if (props.variant === "route") {
    return (
      <Link href={props.href} className={extraStyles}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={extraStyles}
      {...props}
    >
      {props.children}
    </button>
  );
};

export default OrangeButton;
