
import React from 'react';
import { Button } from "@/components/ui/button";

interface ListSorterProps {
  sortField: string;
  sortDirection: "asc" | "desc";
  handleSort: (field: string) => void;
}

export const ListSorter: React.FC<ListSorterProps> = ({
  sortField,
  sortDirection,
  handleSort
}) => {
  return (
    <div className="flex items-center gap-2 text-sm font-normal">
      <span>Sort by:</span>
      <div className="flex gap-1">
        <Button 
          variant={sortField === "start" ? "secondary" : "ghost"} 
          size="sm"
          onClick={() => handleSort("start")}
          className="h-7 text-xs"
        >
          Date {sortField === "start" && (sortDirection === "asc" ? "↑" : "↓")}
        </Button>
        <Button 
          variant={sortField === "title" ? "secondary" : "ghost"} 
          size="sm"
          onClick={() => handleSort("title")}
          className="h-7 text-xs"
        >
          Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
        </Button>
        <Button 
          variant={sortField === "platform" ? "secondary" : "ghost"} 
          size="sm"
          onClick={() => handleSort("platform")}
          className="h-7 text-xs"
        >
          Platform {sortField === "platform" && (sortDirection === "asc" ? "↑" : "↓")}
        </Button>
      </div>
    </div>
  );
};
