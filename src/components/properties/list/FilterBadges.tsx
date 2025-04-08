
import React from "react";
import { Badge } from "@/components/ui/badge";

interface FilterBadgesProps {
  propertyType: string;
  cityFilter: string;
  onClearPropertyType: () => void;
  onClearCity: () => void;
}

export function FilterBadges({ 
  propertyType, 
  cityFilter, 
  onClearPropertyType, 
  onClearCity 
}: FilterBadgesProps) {
  if (propertyType === 'all' && !cityFilter) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {propertyType !== 'all' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>Type: {propertyType}</span>
          <button 
            onClick={onClearPropertyType} 
            className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
          >
            ×
          </button>
        </Badge>
      )}
      {cityFilter && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <span>City: {cityFilter}</span>
          <button 
            onClick={onClearCity} 
            className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 h-4 w-4 inline-flex items-center justify-center"
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );
}
