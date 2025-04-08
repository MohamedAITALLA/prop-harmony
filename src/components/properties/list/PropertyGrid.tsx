
import React from 'react';
import { Property } from "@/types/api-responses";
import { PropertyCard } from "@/components/properties/list/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

interface PropertyGridProps {
  properties: Property[];
  isLoading: boolean;
  onPropertyClick: (property: Property) => void;
}

export const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  properties, 
  isLoading, 
  onPropertyClick 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-40 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No properties found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or add a new property.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard 
          key={property._id} 
          property={property} 
          onClick={() => onPropertyClick(property)}
        />
      ))}
    </div>
  );
};
