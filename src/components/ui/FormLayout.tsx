import * as React from "react"
import { cn } from "@/lib/utils"
import { formStyles } from "./form-styles"

export function FormSection({ className, title, children, ...props }: React.ComponentProps<"div"> & { title?: React.ReactNode }) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {title && (
        <h3 className={formStyles.sectionTitle}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export function FormGrid({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)} {...props}>
      {children}
    </div>
  )
}

export function FormRow({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("md:col-span-2", className)} {...props}>
      {children}
    </div>
  )
}
