"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

const RangeSlider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={(`relative flex w-full touch-none select-none items-center ${  className}`)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-primary-white">
      <SliderPrimitive.Range className="absolute h-full bg-medium-green" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-dark-green ring-offset-bg-primary-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-dark-green ring-offset-bg-primary-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-green focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
RangeSlider.displayName = SliderPrimitive.Root.displayName;

export { RangeSlider };
