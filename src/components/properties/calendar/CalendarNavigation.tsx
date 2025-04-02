
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 bg-muted/30 p-4 rounded-lg">
      <div className="text-xl font-semibold flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-primary" />
        <span>{format(currentDate, 'MMMM yyyy')}</span>
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleCalendarNavigation('prev')}
          className="shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>
        
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => handleCalendarNavigation('today')}
          className="shadow-sm"
        >
          Today
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => handleCalendarNavigation('next')}
          className="shadow-sm"
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
