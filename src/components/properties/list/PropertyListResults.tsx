
import React from "react";
import { Property } from "@/types/api-responses";
import { PropertyListSkeleton } from "./PropertyListSkeleton";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { PropertyGrid } from "./PropertyGrid";
import { PropertyPaginationInfo } from "./PropertyPaginationInfo";

interface PropertyListResultsProps {
  properties: Property[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  onResetFilters: () => void;
  onPropertyClick: (id: string) => void;
}

export function PropertyListResults({ 
  properties, 
  isLoading, 
  viewMode, 
  pagination, 
  onResetFilters,
  onPropertyClick 
}: PropertyListResultsProps) {
  if (isLoading) {
    return <PropertyListSkeleton viewMode={viewMode} />;
  }
  
  if (!properties || properties.length === 0) {
    return <PropertyEmptyState onResetFilters={onResetFilters} />;
  }
  
  return (
    <>
      <PropertyPaginationInfo 
        count={properties.length} 
        pagination={pagination} 
      />
      
      <PropertyGrid 
        properties={properties}
        viewMode={viewMode}
        onPropertyClick={onPropertyClick}
      />
    </>
  );
}
