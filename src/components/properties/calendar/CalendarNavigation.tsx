
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarNavigationProps {
  currentDate: Date;
  handleCalendarNavigation: (action: 'prev' | 'next' | 'today') => void;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  currentDate,
  handleCalendarNavigation
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('prev')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('today')}>
          Today
        </Button>
        <Button size="sm" variant="outline" onClick={() => handleCalendarNavigation('next')}>
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <div id="calendar-title" className="text-lg font-medium">
        {format(currentDate, 'MMMM yyyy')}
      </div>
    </div>
  );
};
