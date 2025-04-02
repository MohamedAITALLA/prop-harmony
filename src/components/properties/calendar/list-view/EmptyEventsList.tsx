
import React from 'react';
import { CalendarRange, Search } from "lucide-react";

interface EmptyEventsListProps {
  searchQuery: string;
}

export const EmptyEventsList: React.FC<EmptyEventsListProps> = ({ searchQuery }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 text-muted-foreground bg-muted/10 rounded-lg border border-dashed border-border/60 animate-fade-in">
      <div className="bg-muted/20 h-16 w-16 rounded-full flex items-center justify-center mb-4">
        {searchQuery ? <Search className="h-8 w-8 opacity-30" /> : <CalendarRange className="h-8 w-8 opacity-30" />}
      </div>
      <p className="font-medium text-base text-foreground">{searchQuery ? "No matching events found" : "No events found"}</p>
      <p className="text-sm mt-3 max-w-md">
        {searchQuery 
          ? "Try adjusting your search query or removing some filters to see more results" 
          : "This property doesn't have any events yet. Try creating a new event or syncing with a platform."}
      </p>
    </div>
  );
};
