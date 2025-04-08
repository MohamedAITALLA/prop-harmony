
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Property } from "@/types/api-responses";
import { propertyService } from "@/services/property-service";
import { DeletePropertyDialog } from "../DeletePropertyDialog";
import { PropertyTable } from "./PropertyTable";
import { SortField, SortDirection } from "./PropertyTableUtils";

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{id: string, name: string} | null>(null);

  // Type-safe wrapper functions for setting sort field and direction
  const handleSetSortField = (field: string) => {
    setSortField(field as SortField);
  };
  
  const handleSetSortDirection = (direction: string) => {
    setSortDirection(direction as SortDirection);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAction = (action: string, property: Property) => {
    switch (action) {
      case "View":
        navigate(`/properties/${property._id}`);
        break;
      case "Edit":
        navigate(`/properties/${property._id}/edit`);
        break;
      case "Sync Now":
        toast.success(`Property ${property.name} synced successfully`);
        break;
      case "Delete":
        // Open delete confirmation dialog
        setPropertyToDelete({
          id: property._id,
          name: property.name
        });
        setDeleteDialogOpen(true);
        break;
    }
  };
  
  const handleDeleteConfirm = async (preserveHistory: boolean) => {
    if (!propertyToDelete) return;
    
    try {
      await propertyService.deleteProperty(propertyToDelete.id, preserveHistory);
      
      const actionText = preserveHistory ? "archived" : "deleted";
      const descriptionText = preserveHistory 
        ? "The property has been made inactive but historical data is preserved for reporting purposes."
        : "All property data has been permanently deleted.";
      
      toast.success(`Property ${propertyToDelete.name} ${actionText} successfully`, {
        description: descriptionText
      });
      
      // Call the callback to refresh the property list
      if (onPropertyDeleted) {
        onPropertyDeleted(propertyToDelete.id);
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(`Failed to delete property: ${(error as Error).message}`);
    } finally {
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setPropertyType("");
    setCityFilter("");
  };

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
