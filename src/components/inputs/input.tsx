import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={
        `flex h-10 w-full rounded-md border border-input-border-gray bg-primary-white px-3 py-2 text-[16px] text-darkest-green ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-input-border-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`
      }
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
