
import React from 'react';
import { Button } from "@/components/ui/button";

interface ViewControlsProps {
  view: string;
  setView: (view: string) => void;
  handleCalendarNavigation: (action: 'today') => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  view,
  setView,
  handleCalendarNavigation
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button 
        variant={view === "month" ? "secondary" : "outline"}
        onClick={() => setView("month")}
      >
        Month
      </Button>
      <Button 
        variant={view === "week" ? "secondary" : "outline"}
        onClick={() => setView("week")}
      >
        Week
      </Button>
      <Button 
        variant={view === "day" ? "secondary" : "outline"}
        onClick={() => setView("day")}
      >
        Day
      </Button>
      <Button 
        variant={view === "list" ? "secondary" : "outline"}
        onClick={() => setView("list")}
      >
        List
      </Button>
      <Button 
        variant="default"
        onClick={() => handleCalendarNavigation('today')}
        size="sm"
      >
        Today
      </Button>
    </div>
  );
};
