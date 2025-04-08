
import React from "react";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Property } from "@/types/api-responses";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";
import { PropertyTableHeader } from "./PropertyTableHeader";
import { PropertyTableRow } from "./PropertyTableRow";
import { PropertyEmptyState } from "./PropertyEmptyState";
import { PropertyLoadingSkeleton } from "./PropertyLoadingSkeleton";
import { 
  SortField, 
  SortDirection,
  filterProperties,
  sortProperties,
  renderSortIndicator
} from "./PropertyTableUtils";

interface PropertyTableProps {
  properties: Property[];
  isLoading?: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  handleSetSortField: (field: string) => void;
  handleSetSortDirection: (direction: string) => void;
  handleSort: (field: SortField) => void;
  handleAction: (action: string, property: Property) => void;
  handleClearFilters: () => void;
  onPageChange?: (page: number) => void;
}

export function PropertyTable({ 
  properties, 
  isLoading = false,
  pagination,
  searchQuery,
  setSearchQuery,
  propertyType,
  setPropertyType,
  cityFilter,
  setCityFilter,
  sortField,
  sortDirection,
  handleSetSortField,
  handleSetSortDirection,
  handleSort,
  handleAction,
  handleClearFilters,
  onPageChange
}: PropertyTableProps) {
  
  const filteredProperties = filterProperties(properties, searchQuery, propertyType, cityFilter);
  const sortedProperties = sortProperties(filteredProperties, sortField, sortDirection);

  return (
    <div className="space-y-4">
      <PropertyTableHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        sortField={sortField}
        sortDirection={sortDirection}
        setSortField={handleSetSortField}
        setSortDirection={handleSetSortDirection}
      />

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("name")}
              >
                Property Name {renderSortIndicator(sortField, "name", sortDirection, ChevronUp, ChevronDown)}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("property_type")}
              >
                Type {renderSortIndicator(sortField, "property_type", sortDirection, ChevronUp, ChevronDown)}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("address.city")}
              >
                Location {renderSortIndicator(sortField, "address.city", sortDirection, ChevronUp, ChevronDown)}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("bookings_count")}
              >
                Active Bookings {renderSortIndicator(sortField, "bookings_count", sortDirection, ChevronUp, ChevronDown)}
              </TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <PropertyLoadingSkeleton />
            ) : sortedProperties.length === 0 ? (
              <PropertyEmptyState onClearFilters={handleClearFilters} />
            ) : (
              sortedProperties.map((property) => (
                <PropertyTableRow 
                  key={property._id}
                  property={property}
                  onAction={handleAction}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination && pagination.pages > 1 && onPageChange && (
        <div className="flex justify-center mt-4">
          <AdvancedPagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={onPageChange}
          />
        </div>
      )}
      
      {!isLoading && sortedProperties.length > 0 && (
        <div className="text-sm text-muted-foreground text-right">
          Showing {sortedProperties.length} of {properties.length} properties
        </div>
      )}
    </div>
  );
}
