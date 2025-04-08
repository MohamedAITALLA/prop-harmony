
import React from "react";
import { Property } from "@/types/api-responses";
import { Tabs } from "@/components/ui/tabs";
import { PropertyViewTabs } from "./view/PropertyViewTabs";
import { PropertyViewContent } from "./view/PropertyViewContent";

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
      <Tabs value={viewMode} className="w-full">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <PropertyViewTabs viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        <PropertyViewContent 
          viewMode={viewMode}
          properties={properties}
          isLoading={isLoading}
          pagination={pagination}
          summary={summary}
          onPageChange={onPageChange}
          onPropertyDeleted={onPropertyDeleted}
        />
      </Tabs>
    </div>
  );
}
