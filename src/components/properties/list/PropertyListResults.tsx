
import React from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCard } from "../PropertyCard";
import { Property } from "@/types/api-responses";

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
    return (
      <div className={viewMode === 'grid' ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" : "space-y-4"}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={viewMode === 'grid' ? "" : "flex"}>
            <Skeleton className={viewMode === 'grid' ? "h-[300px] w-full rounded-lg" : "h-[150px] w-[250px] rounded-lg flex-shrink-0"} />
            {viewMode === 'list' && (
              <div className="ml-4 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-lg border border-dashed">
        <div className="flex flex-col items-center space-y-2">
          <div className="rounded-full bg-primary/10 p-3">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            We couldn't find any properties that match your search criteria. Try adjusting your filters or add a new property.
          </p>
          <div className="mt-4 flex space-x-2">
            <Button variant="outline" onClick={onResetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => window.location.href = '/properties/new'}>
              <Plus className="w-4 h-4 mr-2" /> Add Property
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex justify-between items-center text-sm text-muted-foreground border-b pb-3">
        <div>
          Showing {properties.length} properties
          {pagination && ` of ${pagination.total}`}
        </div>
        {pagination && (
          <div>
            Page {pagination.page} of {pagination.pages}
          </div>
        )}
      </div>
      
      <div className={viewMode === 'grid' 
        ? "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3" 
        : "space-y-4"}>
        {properties.map((property) => {
          const propertyId = String(property._id || property.id || '');
          
          return (
            <PropertyCard
              key={propertyId}
              property={property}
              viewMode={viewMode}
              onClick={() => onPropertyClick(propertyId)}
            />
          );
        })}
      </div>
    </>
  );
}
