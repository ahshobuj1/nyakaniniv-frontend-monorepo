"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "../../lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-2xl shadow-xl border border-gray-100", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-sm font-bold text-gray-900",
        nav: "flex items-center gap-1",
        button_previous: cn(
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all cursor-pointer text-gray-700 absolute left-1"
        ),
        button_next: cn(
          "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-all cursor-pointer text-gray-700 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex justify-between mb-2",
        weekday:
          "text-gray-400 rounded-md w-9 font-semibold text-[0.8rem] text-center uppercase tracking-wider",
        week: "flex w-full justify-between mt-1.5",
        day: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:rounded-lg"
        ),
        day_button: cn(
          "h-9 w-9 p-0 font-medium text-gray-800 rounded-lg transition-all flex items-center justify-center cursor-pointer hover:bg-gray-100 hover:text-gray-900 aria-selected:opacity-100 text-[13px]"
        ),
        range_start: "day-range-start",
        range_end: "day-range-end",
        selected:
          "!bg-primary !text-white hover:!bg-primary hover:!text-white focus:!bg-primary focus:!text-white font-bold shadow-md",
        today: "border border-primary text-primary font-bold",
        outside:
          "day-outside text-gray-300 opacity-50 aria-selected:bg-primary/10 aria-selected:text-gray-500 aria-selected:opacity-30",
        disabled: "text-gray-300 opacity-40 cursor-not-allowed hover:bg-transparent",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          return orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        },
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
