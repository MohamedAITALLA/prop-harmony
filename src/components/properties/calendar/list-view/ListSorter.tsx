
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, SortAsc } from "lucide-react";

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
  const getSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? 
        <ArrowUp className="h-3.5 w-3.5 ml-1" /> : 
        <ArrowDown className="h-3.5 w-3.5 ml-1" />;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2 text-sm font-normal">
      <SortAsc className="h-4 w-4 text-muted-foreground mr-1" />
      <span className="text-muted-foreground">Sort:</span>
      <div className="flex gap-1">
        <Button 
          variant={sortField === "start" ? "secondary" : "outline"} 
          size="sm"
          onClick={() => handleSort("start")}
          className="h-7 text-xs font-medium px-2.5 flex items-center"
        >
          Date {getSortIcon("start")}
        </Button>
        <Button 
          variant={sortField === "title" ? "secondary" : "outline"} 
          size="sm"
          onClick={() => handleSort("title")}
          className="h-7 text-xs font-medium px-2.5 flex items-center"
        >
          Title {getSortIcon("title")}
        </Button>
        <Button 
          variant={sortField === "platform" ? "secondary" : "outline"} 
          size="sm"
          onClick={() => handleSort("platform")}
          className="h-7 text-xs font-medium px-2.5 flex items-center"
        >
          Platform {getSortIcon("platform")}
        </Button>
      </div>
    </div>
  );
};
