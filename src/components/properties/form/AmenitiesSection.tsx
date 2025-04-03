
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./PropertyFormSchema";
import { AmenityItem } from "./amenities/AmenityItem";
import { amenitiesConfig } from "./amenities/AmenitiesConfig";

interface AmenitySectionProps {
  form: UseFormReturn<FormValues>;
}

export function AmenitiesSection({ form }: AmenitySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Amenities</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {amenitiesConfig.map((amenity) => (
          <AmenityItem
            key={amenity.name.toString()}
            form={form}
            name={amenity.name}
            label={amenity.label}
            icon={amenity.icon}
          />
        ))}
      </div>
    </div>
  );
}
