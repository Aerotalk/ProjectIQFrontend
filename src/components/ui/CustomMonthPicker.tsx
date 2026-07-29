import React, { useState } from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { Controller, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formStyles } from "@/components/ui/form-styles"

interface CustomMonthPickerProps {
  name?: string
  value?: string
  onChange?: (val: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  hasError?: boolean
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function CustomMonthPicker({
  name,
  value,
  onChange,
  disabled,
  className,
  placeholder = "Select Month & Year",
  hasError
}: CustomMonthPickerProps) {
  const formContext = useFormContext()
  
  const getParsedDate = (val?: string) => {
    if (!val) return undefined
    const parsed = parse(val, "MMMM yyyy", new Date())
    if (isValid(parsed)) return parsed
    
    // Also try yyyy-MM if it's ISO prefix
    const parsedIso = parse(val, "yyyy-MM", new Date())
    if (isValid(parsedIso)) return parsedIso
    return undefined
  }

  const MonthPickerTrigger = React.forwardRef<HTMLButtonElement, any>(
    ({ disabled, triggerClasses, currentValue, placeholder, ...props }, ref) => {
      const d = getParsedDate(currentValue)
      return (
        <button
          type="button"
          disabled={disabled}
          className={triggerClasses}
          ref={ref}
          {...props}
        >
          {d ? format(d, "MMMM yyyy") : <span className="text-gray-400">{placeholder}</span>}
          <CalendarIcon className="h-4 w-4 text-gray-400 opacity-50" />
        </button>
      )
    }
  )
  MonthPickerTrigger.displayName = "MonthPickerTrigger"

  const handleDateChange = (date: Date, triggerChange: (val: string) => void) => {
    // Format output as "MMMM yyyy", e.g., "July 2026"
    triggerChange(format(date, "MMMM yyyy"))
  }

  const triggerClasses = cn(
    formStyles.field(hasError, disabled),
    "flex items-center justify-between text-left font-normal cursor-pointer w-full",
    !value && "text-muted-foreground",
    className
  )



  const MonthSelector = ({ 
    currentValue, 
    onChangeVal, 
    onClose 
  }: { 
    currentValue?: string, 
    onChangeVal: (v: string) => void,
    onClose: () => void 
  }) => {
    const parsed = getParsedDate(currentValue)
    const [year, setYear] = useState(parsed ? parsed.getFullYear() : new Date().getFullYear())

    const handleMonthClick = (monthIndex: number) => {
      const newDate = new Date(year, monthIndex, 1)
      handleDateChange(newDate, onChangeVal)
      onClose()
    }

    return (
      <div className="w-64 p-3 bg-white dark:bg-[#181a1f] rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => setYear(y => y - 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors text-gray-500"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">{year}</span>
          <button 
            onClick={() => setYear(y => y + 1)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded-sm transition-colors text-gray-500"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, idx) => {
            const isSelected = parsed && parsed.getMonth() === idx && parsed.getFullYear() === year
            return (
              <button
                key={month}
                onClick={() => handleMonthClick(idx)}
                className={`py-2 text-sm rounded-sm transition-colors ${
                  isSelected 
                    ? 'bg-primary text-white font-medium' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                {month.substring(0, 3)}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (formContext && name) {
    return (
      <Controller
        name={name}
        control={formContext.control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <MonthPickerTrigger 
                disabled={disabled} 
                triggerClasses={triggerClasses} 
                currentValue={field.value} 
                placeholder={placeholder} 
              />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto p-0 shadow-lg rounded-lg border border-gray-200 dark:border-white/10"
            >
              <MonthSelector 
                currentValue={field.value} 
                onChangeVal={field.onChange} 
                onClose={() => {
                  // Simulate an escape or click away by clicking body, 
                  // Radix popover handles internal clicks nicely if we have controlled state,
                  // but for uncontrolled popover it closes when trigger is focused or clicked away.
                  // We'll leave it simple.
                  document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                }}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <MonthPickerTrigger 
          disabled={disabled} 
          triggerClasses={triggerClasses} 
          currentValue={value} 
          placeholder={placeholder} 
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto p-0 shadow-lg rounded-lg border border-gray-200 dark:border-white/10"
      >
        <MonthSelector 
          currentValue={value} 
          onChangeVal={onChange || (() => {})} 
          onClose={() => {
            document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
