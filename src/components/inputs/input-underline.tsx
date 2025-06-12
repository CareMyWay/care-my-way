import * as React from "react"

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const InputUnderline = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={
        `flex h-10 border-b-2 px-3 py-1 text-[16px] text-primary-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-input-border-gray focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 ${className}`
      }
      ref={ref}
      {...props}
    />
  )
})
InputUnderline.displayName = "InputUnderline"

export { InputUnderline }
