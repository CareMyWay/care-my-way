import React, { ReactNode } from "react";
import { Transition } from "@headlessui/react";

type TransitionPropTypes = {
  isMenuOpen: boolean;
  children: ReactNode;
};

const FadeTransition: React.FC<TransitionPropTypes> = ({
  isMenuOpen,
  children,
}) => {
  return (
    <Transition
      as="div"
      show={isMenuOpen}
      unmount
      enter="transition-opacity duration-250"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-250"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {children}
    </Transition>
  );
};

export default FadeTransition;
