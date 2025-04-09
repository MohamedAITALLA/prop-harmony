
import React, { useState } from "react";
import { CalendarRange } from "@/components/ui/calendar-range";
import { DateRange } from "react-day-picker";

interface DatePickerWithRangeProps {
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange({ date, onDateChange }: DatePickerWithRangeProps) {
  return (
    <CalendarRange 
      value={date} 
      onChange={onDateChange} 
      className="w-full"
    />
  );
}
