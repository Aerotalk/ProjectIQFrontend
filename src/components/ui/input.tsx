import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-9 w-full min-w-0 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#0f1115] px-3 py-1.5 text-sm text-gray-900 dark:text-white transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#792359] focus:ring-2 focus:ring-[#792359]/20 focus:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-gray-100 dark:disabled:bg-white/5 aria-invalid:border-red-500 aria-invalid:ring-red-500/20 shadow-xs",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
