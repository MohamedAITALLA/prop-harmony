
import React from "react";
import { Tabs } from "@/components/ui/tabs";
import { Property } from "@/types/api-responses";
import { PropertyViewTabs } from "./view/PropertyViewTabs";
import { PropertyViewContent } from "./view/PropertyViewContent";

interface PropertyViewProps {
  properties: Property[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
  };
  summary?: {
    total_properties: number;
    by_property_type: Record<string, number>;
    by_city: Record<string, number>;
    applied_filters: Record<string, any>;
  };
  onPageChange: (page: number) => void;
  onPropertyDeleted: (propertyId: string) => void;
  viewMode: "grid" | "table";
  setViewMode: (value: "grid" | "table") => void;
}

export function PropertyView({
  properties,
  isLoading,
  pagination,
  summary,
  onPageChange,
  onPropertyDeleted,
  viewMode,
  setViewMode
}: PropertyViewProps) {
  return (
    <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
      <PropertyViewTabs viewMode={viewMode} setViewMode={setViewMode} />
      <PropertyViewContent 
        viewMode={viewMode}
        properties={properties}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={onPageChange}
        onPropertyDeleted={onPropertyDeleted}
      />
    </Tabs>
  );
}
