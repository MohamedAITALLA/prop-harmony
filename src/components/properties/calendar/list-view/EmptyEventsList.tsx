
import React from 'react';
import { CalendarRange } from "lucide-react";

interface EmptyEventsListProps {
  searchQuery: string;
}

export const EmptyEventsList: React.FC<EmptyEventsListProps> = ({ searchQuery }) => {
  return (
    <div className="text-center py-14 px-4 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/60">
      <CalendarRange className="mx-auto h-12 w-12 mb-3 opacity-20" />
      <p className="font-medium text-base">No events found</p>
      <p className="text-sm mt-2 max-w-md mx-auto">
        {searchQuery 
          ? "Try adjusting your search query or removing some filters to see more results" 
          : "This property doesn't have any events yet. Try creating a new event or syncing with a platform."}
      </p>
    </div>
  );
};
