
import { useState } from 'react';

export function useListSorting(events: any[]) {
  const [sortField, setSortField] = useState<string>("start");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    if (sortField === "start") {
      const dateA = new Date(a.start).getTime();
      const dateB = new Date(b.start).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }
    
    if (sortField === "title") {
      return sortDirection === "asc" 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    }
    
    if (sortField === "platform") {
      const platformA = a.extendedProps?.platform || "";
      const platformB = b.extendedProps?.platform || "";
      return sortDirection === "asc" 
        ? platformA.localeCompare(platformB) 
        : platformB.localeCompare(platformA);
    }
    
    return 0;
  });

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedEvents
  };
}
