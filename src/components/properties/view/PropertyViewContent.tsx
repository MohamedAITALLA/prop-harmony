
import React from "react";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTableContainer } from "@/components/properties/table/PropertyTableContainer";
import { Property } from "@/types/api-responses";

interface PropertyViewContentProps {
  viewMode: "grid" | "list" | "table";
  properties: Property[];
  isLoading: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next_page?: boolean;
    has_previous_page?: boolean;
  };
  summary?: {
    total_properties: number;
    by_property_type: Record<string, number>;
    by_city: Record<string, number>;
    applied_filters: Record<string, any>;
  };
  onPageChange?: (page: number) => void;
  onPropertyDeleted?: (propertyId: string) => void;
}

export function PropertyViewContent({
  viewMode,
  properties,
  isLoading,
  pagination,
  summary,
  onPageChange,
  onPropertyDeleted
}: PropertyViewContentProps) {
  // Instead of using TabsContent, we'll conditionally render based on viewMode
  if (viewMode === "table") {
    return (
      <PropertyTableContainer
        properties={properties}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onPropertyDeleted={onPropertyDeleted}
      />
    );
  }
  
  // For both grid and list views, use PropertyList with the appropriate viewMode
  return (
    <PropertyList 
      properties={properties} 
      isLoading={isLoading} 
      viewMode={viewMode}
      pagination={pagination}
      summary={summary}
      onPageChange={onPageChange}
      onPropertyDeleted={onPropertyDeleted}
    />
  );
}
