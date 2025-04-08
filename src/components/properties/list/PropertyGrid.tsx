
import React from "react";
import { PropertyCard } from "../PropertyCard";
import { Property } from "@/types/api-responses";

interface PropertyGridProps {
  properties: Property[];
  viewMode: 'grid' | 'list';
  onPropertyClick: (id: string) => void;
}

export function PropertyGrid({ properties, viewMode, onPropertyClick }: PropertyGridProps) {
  return (
    <div className={viewMode === 'grid' 
      ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
      : "space-y-4"}>
      {properties.map((property) => {
        // Extract the ID as a string to fix the TypeScript error
        const propertyId = String(property._id || property.id || '');
        
        return (
          <PropertyCard
            key={propertyId}
            property={property}
            viewMode={viewMode}
            onClick={() => onPropertyClick(propertyId)}
          />
        );
      })}
    </div>
  );
}
