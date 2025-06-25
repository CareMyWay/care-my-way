import React, { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

interface BaseProps {
  size?: string
  className?: string
  onClick?: () => void
  children?: React.ReactNode
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
  "bg-dark-green rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md transition-all hover:bg-darkest-green uppercase inline-block";

interface RouteButtonProps extends BaseProps {
  variant: "route";
  href: string;
  label: React.ReactNode;
}

interface ActionButtonProps extends BaseProps {
  variant: "action";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  label: React.ReactNode;
}

const GreenButton: React.FC<ButtonPropTypes> = ({
  label,
  className,
  ...props
}) => {
  const classes = clsx(BUTTON_STYLE, className);

  if (props.variant === "route") {
    return (
      <Link href={props.href} className={classes}>
        {props.children}
      </Link>
    );
  }

  // "action" variant
  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={clsx("flex items-center justify-center gap-1", className)}
    >
      {label}
    </button>
  );
};

export default GreenButton;
