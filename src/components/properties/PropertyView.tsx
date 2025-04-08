
import React from "react";
import { Property } from "@/types/api-responses";
import { PropertyViewContent } from "./view/PropertyViewContent";

interface PropertyViewProps {
  properties: Property[];
  isLoading?: boolean;
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
  viewMode: 'grid' | 'list' | 'table';
  setViewMode: (viewMode: 'grid' | 'list' | 'table') => void;
}

export function PropertyView({
  properties,
  isLoading = false,
  pagination,
  summary,
  onPageChange,
  onPropertyDeleted,
  viewMode,
  setViewMode
}: PropertyViewProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <PropertyViewContent 
        viewMode={viewMode}
        properties={properties}
        isLoading={isLoading}
        pagination={pagination}
        summary={summary}
        onPageChange={onPageChange}
        onPropertyDeleted={onPropertyDeleted}
      />
    </div>
  );
}
