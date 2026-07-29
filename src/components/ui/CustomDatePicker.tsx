import React, { useState } from "react"
import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formStyles } from "@/components/ui/form-styles"

interface CustomDatePickerProps {
  name?: string
  value?: string
  onChange?: (val: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  hasError?: boolean
}

const getParsedDate = (val?: string) => {
  if (!val) return undefined
  try {
    const d = parseISO(val.split('T')[0])
    return isNaN(d.getTime()) ? undefined : d
  } catch {
    return undefined
  }
}

// forwardRef trigger so Radix PopoverTrigger asChild works
const DatePickerTrigger = React.forwardRef<
  HTMLButtonElement,
  { value?: string; placeholder?: string; disabled?: boolean; hasError?: boolean; className?: string; [k: string]: any }
>(({ value, placeholder, disabled, hasError, className, ...rest }, ref) => {
  const d = getParsedDate(value)
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      {...rest}
      className={cn(
        formStyles.field(hasError, disabled),
        "flex items-center justify-between text-left cursor-pointer w-full",
        className
      )}
    >
      {d ? (
        <span className="text-sm text-gray-900 dark:text-white">{format(d, "dd MMM yyyy")}</span>
      ) : (
        <span className="text-sm text-gray-400">{placeholder || "Pick a date"}</span>
      )}
      <CalendarIcon size={15} className={cn("shrink-0", d ? "text-[#792359]" : "text-gray-400 opacity-60")} />
    </button>
  )
})
DatePickerTrigger.displayName = "DatePickerTrigger"

export default function CustomDatePicker({
  name,
  value,
  onChange,
  disabled,
  className,
  placeholder = "Pick a date",
  hasError,
}: CustomDatePickerProps) {
  const formContext = useFormContext()
  const [open, setOpen] = useState(false)

  const handleDateChange = (date: Date | undefined, triggerChange: (val: string) => void) => {
    triggerChange(date ? format(date, "yyyy-MM-dd") : "")
    setOpen(false)
  }

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field, fieldState }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <DatePickerTrigger
                value={field.value}
                placeholder={placeholder}
                disabled={disabled}
                hasError={!!fieldState.error || hasError}
                className={className}
              />
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-2 shadow-lg rounded-lg z-[300]">
              <Calendar
                mode="single"
                selected={getParsedDate(field.value)}
                onSelect={(date) => handleDateChange(date, field.onChange)}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        )}
      />
    )
  }

  // Uncontrolled mode
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <DatePickerTrigger
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          hasError={hasError}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-2 shadow-lg rounded-lg z-[300]">
        <Calendar
          mode="single"
          selected={getParsedDate(value)}
          onSelect={(date) => handleDateChange(date, onChange || (() => {}))}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
