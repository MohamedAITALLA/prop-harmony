
import React from 'react';
import { CalendarRange } from "lucide-react";

interface EmptyEventsListProps {
  searchQuery: string;
}

export const EmptyEventsList: React.FC<EmptyEventsListProps> = ({ searchQuery }) => {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <CalendarRange className="mx-auto h-10 w-10 mb-2 opacity-20" />
      <p className="font-medium">No events found</p>
      <p className="text-sm mt-1">
        {searchQuery 
          ? "Try adjusting your search query or filters" 
          : "Try creating a new event or adjusting your filters"}
      </p>
    </div>
  );
};
