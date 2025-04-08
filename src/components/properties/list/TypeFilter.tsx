
import React from "react";
import { PropertyType } from "@/types/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TypeFilterProps {
  propertyType: string;
  onPropertyTypeChange: (value: string) => void;
}

export function TypeFilter({ propertyType, onPropertyTypeChange }: TypeFilterProps) {
  return (
    <Select value={propertyType} onValueChange={onPropertyTypeChange}>
      <SelectTrigger className="w-[150px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <SelectValue placeholder="All Types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Types</SelectItem>
        <SelectItem value={PropertyType.APARTMENT}>Apartment</SelectItem>
        <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
        <SelectItem value={PropertyType.VILLA}>Villa</SelectItem>
        <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
        <SelectItem value={PropertyType.CABIN}>Cabin</SelectItem>
        <SelectItem value={PropertyType.ROOM}>Room</SelectItem>
        <SelectItem value={PropertyType.HOTEL}>Hotel</SelectItem>
        <SelectItem value={PropertyType.OTHER}>Other</SelectItem>
      </SelectContent>
    </Select>
  );
}
