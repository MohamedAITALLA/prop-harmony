
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertySelectProps {
  value: string | null;
  onValueChange: (value: string) => void;
  includeAllOption?: boolean;
}

export function PropertySelect({ value, onValueChange, includeAllOption = false }: PropertySelectProps) {
  const properties = [
    { _id: "prop-1", name: "Oceanfront Villa" },
    { _id: "prop-2", name: "Mountain Cabin" },
    { _id: "prop-3", name: "Downtown Loft" },
  ];
  
  return (
    <Select value={value || "all_properties"} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a property" />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && <SelectItem value="all">All Properties</SelectItem>}
        {properties.map((property) => (
          <SelectItem key={property._id} value={property._id}>
            {property.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
