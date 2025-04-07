
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Users } from "lucide-react";
import { FormValues } from "./PropertyFormSchema";
import { BedroomsField } from "./capacity/BedroomsField";
import { BathroomsField } from "./capacity/BathroomsField";
import { BedsField } from "./capacity/BedsField";
import { AccommodatesField } from "./capacity/AccommodatesField";

interface CapacitySectionProps {
  form: UseFormReturn<FormValues>;
}

export function CapacitySection({ form }: CapacitySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <Users className="h-4 w-4" /> Capacity & Rooms
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Bedrooms */}
        <BedroomsField form={form} />

        {/* Bathrooms */}
        <BathroomsField form={form} />

        {/* Beds */}
        <BedsField form={form} />

        {/* Accommodates */}
        <AccommodatesField form={form} />
      </div>
    </div>
  );
}
