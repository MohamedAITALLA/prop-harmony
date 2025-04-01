import React from "react";
import { addDays, parseISO } from "date-fns";
import { DateRange as RDPDateRange } from "react-day-picker";
import { CalendarRange } from "@/components/ui/calendar-range";
import { DateRangeDisplay } from "@/components/ui/date-range-display";

interface DateRangeProps {
  startDate?: string;
  endDate?: string;
  format?: string;
  showIcon?: boolean;
  className?: string;
  value?: RDPDateRange;
  onChange?: (date: RDPDateRange | undefined) => void;
  selected?: RDPDateRange;
  onSelect?: (date: RDPDateRange | undefined) => void;
}

export const DateRange: React.FC<DateRangeProps> = (props) => {
  // If we have startDate/endDate props, use DateRangeDisplay component
  if (props.startDate && props.endDate) {
    return (
      <DateRangeDisplay
        startDate={props.startDate}
        endDate={props.endDate}
        format={props.format}
        showIcon={props.showIcon}
        className={props.className}
      />
    );
  }
  
  // Otherwise pass through to CalendarRange
  const value = props.value || props.selected;
  const onChange = props.onChange || props.onSelect;
  
  return (
    <CalendarRange
      value={value}
      onChange={onChange}
      className={props.className}
    />
  );
};
