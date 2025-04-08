
import React from "react";
import { PropertyList } from "./PropertyList";
import { PropertyTableContainer } from "./table/PropertyTableContainer";
import { Property } from "@/types/api-responses";

interface PropertyViewProps {
  properties: Property[];
  isLoading?: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
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
      {viewMode === 'table' ? (
        <PropertyTableContainer
          properties={properties}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={onPageChange}
          onPropertyDeleted={onPropertyDeleted}
        />
      ) : (
        <PropertyList
          properties={properties}
          isLoading={isLoading}
          viewMode={viewMode}
          onPageChange={onPageChange}
          onPropertyDeleted={onPropertyDeleted}
          summary={summary}
        />
      )}
    </div>
  );
}
