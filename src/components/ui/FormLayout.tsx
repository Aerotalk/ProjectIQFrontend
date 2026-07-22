import * as React from "react"
import { cn } from "@/lib/utils"
import { formStyles } from "./form-styles"

/**
 * FormSection — wraps a group of related fields with an optional title.
 */
export function FormSection({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"div"> & { title?: React.ReactNode }) {
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

/**
 * FormGrid — the primary layout mechanism for forms.
 *
 * columns={2} (default): 1-col mobile → 2-col tablet+desktop
 * columns={3}:           1-col mobile → 2-col tablet → 3-col XL desktop
 *
 * Fields placed directly inside FormGrid occupy one column each.
 * Use className="col-span-2" or className="col-span-full" on any child
 * to make it span the full row.
 */
export function FormGrid({
  className,
  columns = 2,
  children,
  ...props
}: React.ComponentProps<"div"> & { columns?: 2 | 3 }) {
  return (
    <div
      className={cn(
        "grid gap-6",
        columns === 3
          ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * FormRow — forces a child to span the full width of the FormGrid.
 * Use for Description, Address, Notes, Attachments, and other long fields.
 *
 * Equivalent to adding className="col-span-full" directly on a div.
 */
export function FormRow({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("col-span-full", className)} {...props}>
      {children}
    </div>
  )
}
