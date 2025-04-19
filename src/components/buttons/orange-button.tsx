import React from "react";
import Link from "next/link";
import clsx from "clsx";

interface BaseProps {
  label: string;
  href: string;
  className?: string;
}

//Button variant for navigation
interface RouteButtonProps extends BaseProps {
  variant: "route";
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

const OrangeButton: React.FC<ButtonPropTypes> = ({
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
    <Link href={props.href} onClick={props.onClick} className={classes}>
      {label}
    </Link>
  );
};

export default OrangeButton;
