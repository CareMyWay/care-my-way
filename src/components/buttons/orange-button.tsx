import React, { ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";

type BaseProps = {
  size?: string
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

//Button variant for navigation
interface RouteButtonProps extends BaseProps {
  variant: "route";
  href: string;
}

//Button variant from for Actions or click handlers

interface ActionButtonProps extends BaseProps {
  variant: "action";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

type ButtonPropTypes = RouteButtonProps | ActionButtonProps;

const BUTTON_STYLE =
  "bg-primary-orange rounded-btn-radius font-btn-font-wgt text-primary-white px-8 py-3 md:text-btn-font-size text-[14px] shadow-md transition-all hover:bg-hover-orange uppercase inline-block";
const OrangeButton: React.FC<ButtonPropTypes & { label: React.ReactNode }> = ({
  label,
  className,
  ...props
}) => {
  const classes = clsx(BUTTON_STYLE, className);
  if (props.variant === "route") {
    return (
      <Link href={props.href} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <button
      type={props.type || "button"}
      onClick={props.onClick}
      className={clsx("flex items-center justify-center gap-1", className)}
    >
      {label}
    </button>
  );
}

export default OrangeButton;
