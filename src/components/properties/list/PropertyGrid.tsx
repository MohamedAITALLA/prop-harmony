
import React from "react";
import { Property } from "@/types/api-responses";
import { PropertyGridCard } from "../cards/PropertyGridCard";

interface PropertyGridProps {
  properties: Property[];
  viewMode: 'grid' | 'list';
  onPropertyDeleted?: (propertyId: string) => void;
  onPropertyClick?: (id: string) => void;
}

export function PropertyGrid({ properties, viewMode, onPropertyDeleted, onPropertyClick }: PropertyGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => {
        const propertyId = property._id || property.id || "";
        return (
          <PropertyGridCard
            key={propertyId}
            property={property}
            onDeleted={() => onPropertyDeleted?.(propertyId)}
            onClick={() => onPropertyClick?.(propertyId)}
            imageUrl={property.images?.[0] || '/placeholder.svg'}
            createdDate={property.created_at ? new Date(property.created_at) : null}
          />
        );
      })}
    </div>
  );
}
