
import React from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface CalendarPageHeaderProps {
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
}

export const CalendarPageHeader: React.FC<CalendarPageHeaderProps> = ({
  hasConflicts,
  onViewConflicts
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl font-semibold">Property Calendar</h2>
        <p className="text-muted-foreground">Manage bookings and availability</p>
      </div>
      <div className="flex items-center gap-2">
        {hasConflicts && (
          <Button variant="destructive" onClick={onViewConflicts}>
            <AlertCircle className="mr-2 h-4 w-4" /> View Conflicts
          </Button>
        )}
      </div>
    </div>
  );
};
