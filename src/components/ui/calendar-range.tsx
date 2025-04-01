
import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CalendarRangeProps {
  className?: string;
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
}

export function CalendarRange({
  className,
  value,
  onChange,
}: CalendarRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: new Date(),
      to: addDays(new Date(), 7),
    }
  );

  // Predefined ranges
  const predefinedRanges = {
    "today": {
      from: new Date(),
      to: new Date()
    },
    "yesterday": {
      from: addDays(new Date(), -1),
      to: addDays(new Date(), -1)
    },
    "last7Days": {
      from: addDays(new Date(), -6),
      to: new Date()
    },
    "next7Days": {
      from: new Date(),
      to: addDays(new Date(), 6)
    },
    "thisMonth": {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    },
    "nextMonth": {
      from: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0)
    }
  };

  const handleRangeSelect = (range: string) => {
    if (range in predefinedRanges) {
      const newRange = predefinedRanges[range as keyof typeof predefinedRanges];
      setDate(newRange);
      onChange?.(newRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <Select onValueChange={handleRangeSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7Days">Last 7 days</SelectItem>
                <SelectItem value="next7Days">Next 7 days</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
                <SelectItem value="nextMonth">Next month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              onChange?.(newDate);
            }}
            numberOfMonths={2}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
