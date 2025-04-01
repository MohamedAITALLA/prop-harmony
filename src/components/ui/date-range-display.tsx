
import React from "react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

export interface DateRangeDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  startDate: string;
  endDate: string;
  format?: string;
  showIcon?: boolean;
}

export function DateRangeDisplay({
  startDate,
  endDate,
  format: formatString = "MMM d, yyyy",
  showIcon = true,
  className,
  ...props
}: DateRangeDisplayProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, formatString);
    } catch (error) {
      console.error("Invalid date format:", error);
      return dateString;
    }
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 text-sm", className)}
      {...props}
    >
      {showIcon && <Calendar className="h-4 w-4 text-muted-foreground" />}
      <span>
        {formattedStartDate} - {formattedEndDate}
      </span>
    </div>
  );
}
