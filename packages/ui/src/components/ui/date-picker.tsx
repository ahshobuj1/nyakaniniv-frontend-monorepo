"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export interface DatePickerProps {
  date?: Date | string
  onSelect?: (date?: Date) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  disabled?: boolean | ((date: Date) => boolean)
  minDate?: Date
  disabledDays?: any
}

export function DatePicker({
  date,
  onSelect,
  placeholder = "Pick a date",
  className,
  buttonClassName,
  disabled,
  minDate,
  disabledDays,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    if (!date) return undefined
    if (typeof date === "string") {
      const parsed = new Date(date)
      return isNaN(parsed.getTime()) ? undefined : parsed
    }
    return date
  }, [date])

  const handleSelect = (newDate?: Date) => {
    onSelect?.(newDate)
    setOpen(false)
  }

  const isDayDisabled = (currentDate: Date) => {
    if (typeof disabled === "function") {
      return disabled(currentDate)
    }
    if (minDate) {
      const todayZero = new Date(minDate)
      todayZero.setHours(0, 0, 0, 0)
      const currentZero = new Date(currentDate)
      currentZero.setHours(0, 0, 0, 0)
      if (currentZero < todayZero) return true
    }
    return false
  }

  return (
    <div className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            disabled={typeof disabled === "boolean" ? disabled : false}
            className={cn(
              "w-full h-11 justify-between text-left font-normal bg-white border border-[#e5e5e5] rounded-[10px] px-4 text-[14px] hover:bg-gray-50 focus:border-primary transition-all",
              !selectedDate && "text-muted-foreground",
              buttonClassName
            )}
          >
            <span className={cn(selectedDate ? "text-gray-900 font-medium" : "text-gray-400")}>
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                placeholder
              )}
            </span>
            <CalendarIcon className="h-4 w-4 text-gray-400 shrink-0 stroke-[1.8]" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 border-none shadow-2xl rounded-2xl bg-white z-50"
          align="start"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={disabledDays || isDayDisabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
