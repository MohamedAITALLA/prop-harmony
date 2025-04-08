
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function SearchBar({ searchQuery, onSearchChange, className }: SearchBarProps) {
  return (
    <div className={`relative w-full md:max-w-sm flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search properties by name, location..."
        value={searchQuery}
        onChange={onSearchChange}
        className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 focus-visible:ring-primary/20"
      />
    </div>
  );
}
