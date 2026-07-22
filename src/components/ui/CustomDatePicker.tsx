
import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

export default function CustomDatePicker({
  name,
  value,
  onChange,
  disabled,
  className,
  placeholder = "Pick a date",
  hasError
}: CustomDatePickerProps) {
  const formContext = useFormContext()

  // Ensure robust parsing
  const getParsedDate = (val?: string) => {
    if (!val) return undefined
    try {
      // Handles both ISO strings and yyyy-MM-dd
      const d = parseISO(val)
      return isNaN(d.getTime()) ? undefined : d
    } catch {
      return undefined
    }
  }

  // Handle format on change
  const handleDateChange = (date: Date | undefined, triggerChange: (val: string) => void) => {
    if (date) {
      // Backend contract format: yyyy-MM-dd (ISO date part)
      // Using format with 'yyyy-MM-dd' ensures local timezone correct output
      triggerChange(format(date, "yyyy-MM-dd"))
    } else {
      triggerChange("")
    }
  }

  const triggerClasses = cn(
    formStyles.field(hasError, disabled),
    "flex items-center justify-between text-left font-normal cursor-pointer w-full",
    !value && "text-muted-foreground",
    className
  )

  const renderTrigger = (currentValue?: string) => {
    const d = getParsedDate(currentValue)
    return (
      <button
        type="button"
        disabled={disabled}
        className={triggerClasses}
      >
        {d ? format(d, "PPP") : <span className="text-gray-400">{placeholder}</span>}
        <CalendarIcon className="h-4 w-4 text-gray-400 opacity-50" />
      </button>
    )
  }

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field }) => {
          const d = getParsedDate(field.value)
          return (
            <Popover>
              <PopoverTrigger asChild>
                {renderTrigger(field.value)}
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-auto p-2 shadow-lg rounded-lg"
              >
                <Calendar
                  mode="single"
                  selected={d}
                  onSelect={(date: Date | undefined) => handleDateChange(date, field.onChange)}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          )
        }}
      />
    )
  }

  // Uncontrolled or manually controlled mode
  const d = getParsedDate(value)
  return (
    <Popover>
      <PopoverTrigger asChild>
        {renderTrigger(value)}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-2 shadow-lg rounded-lg"
      >
        <Calendar
          mode="single"
          selected={d}
          onSelect={(date: Date | undefined) => handleDateChange(date, onChange || (() => { }))}
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
