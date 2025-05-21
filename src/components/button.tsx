import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "cursor-pointer flex h-12 items-center justify-center rounded-full  bg-primary-orange px-4 text-sm uppercase font-medium text-primary-white transition-colors hover:bg-blue-400focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-darkest-green active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}
