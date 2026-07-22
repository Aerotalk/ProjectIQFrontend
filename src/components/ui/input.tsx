import * as React from "react"

import { cn } from "@/lib/utils"
import { formStyles } from "./form-styles"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, "aria-invalid": ariaInvalid, disabled, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          formStyles.field(!!ariaInvalid, disabled),
          "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
