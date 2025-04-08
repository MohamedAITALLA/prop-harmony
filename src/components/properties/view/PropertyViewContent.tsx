
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { Property } from "@/types/api-responses";

interface PropertyViewContentProps {
  viewMode: "grid" | "table";
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
  onPageChange: (page: number) => void;
  onPropertyDeleted: (propertyId: string) => void;
}

export function PropertyViewContent({
  viewMode,
  properties,
  isLoading,
  pagination,
  onPageChange,
  onPropertyDeleted
}: PropertyViewContentProps) {
  return (
    <>
      <TabsContent value="grid" className="mt-0">
        <PropertyList 
          properties={properties} 
          isLoading={isLoading} 
        />
      </TabsContent>
      <TabsContent value="table" className="mt-0">
        <PropertyTable 
          properties={properties} 
          isLoading={isLoading} 
          pagination={pagination}
          onPageChange={onPageChange}
          onPropertyDeleted={onPropertyDeleted}
        />
      </TabsContent>
    </>
  );
}
