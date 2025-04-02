
import React from 'react';
import { Search } from "lucide-react";

interface SearchNoticeProps {
  searchQuery: string;
}

export const SearchNotice: React.FC<SearchNoticeProps> = ({ searchQuery }) => {
  if (!searchQuery) return null;
  
  return (
    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md mb-4">
      <Search className="h-4 w-4" />
      <span className="text-sm">
        Showing results for: <span className="font-medium">{searchQuery}</span>
      </span>
    </div>
  );
};
