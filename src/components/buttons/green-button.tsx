import React, { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

interface BaseProps {
  label: ReactNode;
  href: string;
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
  " text-center bg-dark-green rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md transition-all hover:bg-darkest-green uppercase inline-block";
const GreenButton: React.FC<ButtonPropTypes> = (props) => {
  const extraStyles = clsx(BUTTON_STYLE, props.className);

  if (props.variant === "route") {
    return (
      <Link href={props.href} className={extraStyles}>
        {props.children}
      </Link>
    );
  }

  //Override the default type of button if needed (e.g. submit)
  const { type = "button", ...rest } = props;

  return (
    <button type={type} {...rest} className={extraStyles}>
      {props.children}
    </button>
  );
};

export default GreenButton;
