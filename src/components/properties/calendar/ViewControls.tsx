
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  List, 
  Grid2x2, 
  CalendarDays,
  Plus
} from "lucide-react";
import { format, addDays } from "date-fns";

interface ViewControlsProps {
  view: string;
  setView: (view: string) => void;
  handleCalendarNavigation: (action: 'prev' | 'next' | 'today') => void;
  currentDate: Date;
  onAddEvent?: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  view,
  setView,
  handleCalendarNavigation,
  currentDate,
  onAddEvent
}) => {
  // Format the display based on view type
  const formatDateDisplay = () => {
    switch(view) {
      case 'day':
        return format(currentDate, 'd MMMM yyyy');
      case 'week':
        const endOfWeek = addDays(currentDate, 6);
        return `${format(currentDate, 'd MMM')} - ${format(endOfWeek, 'd MMM yyyy')}`;
      case 'month':
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="mb-4 bg-muted/30 border rounded-lg p-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)} className="bg-background border shadow-sm rounded-md">
          <ToggleGroupItem value="month" aria-label="Month view" className="data-[state=on]:bg-primary data-[state=on]:text-white">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Month</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Week view" className="data-[state=on]:bg-primary data-[state=on]:text-white">
            <Grid2x2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Week</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="day" aria-label="Day view" className="data-[state=on]:bg-primary data-[state=on]:text-white">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Day</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-primary data-[state=on]:text-white">
            <List className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">List</span>
          </ToggleGroupItem>
        </ToggleGroup>
        <Button 
          variant="secondary"
          size="sm"
          onClick={() => handleCalendarNavigation('today')}
          className="bg-background hover:bg-muted"
        >
          Today
        </Button>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleCalendarNavigation('prev')}
          aria-label="Previous"
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium text-sm px-3 py-1.5 bg-background border rounded-md min-w-[120px] text-center">
          {formatDateDisplay()}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleCalendarNavigation('next')}
          aria-label="Next"
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {onAddEvent && (
        <Button 
          variant="default"
          size="sm"
          onClick={onAddEvent}
          className="gap-1"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Event</span>
        </Button>
      )}
    </div>
  );
};
