
import React from "react";
import { Property } from "@/types/api-responses";
import { DeletePropertyDialog } from "../DeletePropertyDialog";
import { PropertyTable } from "./PropertyTable";
import { usePropertyTable } from "@/hooks/properties/usePropertyTable";

export interface PropertyTableContainerProps {
  properties: Property[];
  isLoading?: boolean;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  onPageChange?: (page: number) => void;
  onPropertyDeleted?: (propertyId: string) => void;
}

export function PropertyTableContainer({ 
  properties, 
  isLoading = false,
  pagination,
  onPageChange,
  onPropertyDeleted
}: PropertyTableContainerProps) {
  const {
    // State
    searchQuery,
    setSearchQuery,
    propertyType,
    setPropertyType,
    cityFilter,
    setCityFilter,
    sortField,
    sortDirection,
    deleteDialogOpen,
    propertyToDelete,
    
    // Actions
    handleSetSortField,
    handleSetSortDirection,
    handleSort,
    handleAction,
    handleDeleteConfirm,
    handleClearFilters,
    setDeleteDialogOpen,
    setPropertyToDelete
  } = usePropertyTable({ onPropertyDeleted });

  return (
    <>
      <PropertyTable
        properties={properties}
        isLoading={isLoading}
        pagination={pagination}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        propertyType={propertyType}
        setPropertyType={setPropertyType}
        cityFilter={cityFilter}
        setCityFilter={setCityFilter}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSetSortField={handleSetSortField}
        handleSetSortDirection={handleSetSortDirection}
        handleSort={handleSort}
        handleAction={handleAction}
        handleClearFilters={handleClearFilters}
        onPageChange={onPageChange}
      />
      
      {/* Delete property confirmation dialog */}
      {propertyToDelete && (
        <DeletePropertyDialog 
          propertyName={propertyToDelete.name}
          isOpen={deleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setPropertyToDelete(null);
          }}
        />
      )}
    </>
  );
}
