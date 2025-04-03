
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";
import { Grid, List } from "lucide-react";
import { Property } from "@/types/api-responses";

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
  onPageChange: (page: number) => void;
  onPropertyDeleted: (propertyId: string) => void;
  viewMode: "grid" | "table";
  setViewMode: (value: "grid" | "table") => void;
}

export function PropertyView({
  properties,
  isLoading,
  pagination,
  onPageChange,
  onPropertyDeleted,
  viewMode,
  setViewMode
}: PropertyViewProps) {
  return (
    <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "table")}>
      <TabsList>
        <TabsTrigger value="grid">
          <Grid className="h-4 w-4 mr-2" /> Grid View
        </TabsTrigger>
        <TabsTrigger value="table">
          <List className="h-4 w-4 mr-2" /> Table View
        </TabsTrigger>
      </TabsList>
      <TabsContent value="grid" className="mt-6">
        <PropertyList 
          properties={properties} 
          isLoading={isLoading} 
        />
        <div className="flex justify-center mt-4">
          <AdvancedPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      </TabsContent>
      <TabsContent value="table" className="mt-6">
        <PropertyTable 
          properties={properties} 
          isLoading={isLoading} 
          pagination={pagination}
          onPageChange={onPageChange}
          onPropertyDeleted={onPropertyDeleted}
        />
        <div className="flex justify-center mt-4">
          <AdvancedPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
