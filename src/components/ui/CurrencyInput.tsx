import * as React from "react"
import { cn } from "@/lib/utils"

const CurrencyInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "number", ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <span className="absolute left-3 text-gray-500 dark:text-gray-400">₹</span>
        <input
          type={type}
          data-slot="input"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent pl-8 pr-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
