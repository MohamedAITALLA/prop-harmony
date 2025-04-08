
import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  // Only show badges if filters are active
  if (propertyType === 'all' && cityFilter === 'all_cities') {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {propertyType !== 'all' && (
        <Badge variant="secondary" className="flex items-center gap-1 py-1">
          Type: {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
          <X 
            className="h-3.5 w-3.5 cursor-pointer ml-1" 
            onClick={onClearPropertyType}
          />
        </Badge>
      )}
      
      {cityFilter !== 'all_cities' && (
        <Badge variant="secondary" className="flex items-center gap-1 py-1">
          City: {cityFilter}
          <X 
            className="h-3.5 w-3.5 cursor-pointer ml-1" 
            onClick={onClearCity}
          />
        </Badge>
      )}
    </div>
  );
}
