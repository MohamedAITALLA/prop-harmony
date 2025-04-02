
import React from 'react';
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchNoticeProps {
  searchQuery: string;
  onClear?: () => void;
}

export const SearchNotice: React.FC<SearchNoticeProps> = ({ searchQuery, onClear }) => {
  if (!searchQuery) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-2 bg-muted/30 text-sm border-l-4 border-primary rounded-md p-3 mb-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-primary" />
        <span>
          Showing results for <span className="font-medium">"{searchQuery}"</span>
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 w-7 p-0 hover:bg-background/80"
        onClick={onClear}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Clear search</span>
      </Button>
    </div>
  );
};
