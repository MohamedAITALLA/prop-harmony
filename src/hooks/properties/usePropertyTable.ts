
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/api-responses";
import { propertyService } from "@/services/property-service";
import { SortField, SortDirection } from "@/components/properties/table/PropertyTableUtils";

export interface UsePropertyTableOptions {
  onPropertyDeleted?: (propertyId: string) => void;
}

export interface UsePropertyTableState {
  // Filter and search state
  searchQuery: string;
  propertyType: string;
  cityFilter: string;
  
  // Sorting state
  sortField: SortField;
  sortDirection: SortDirection;
  
  // Delete dialog state
  deleteDialogOpen: boolean;
  propertyToDelete: {id: string, name: string} | null;
}

export interface UsePropertyTableActions {
  // Filter and search actions
  setSearchQuery: (query: string) => void;
  setPropertyType: (type: string) => void;
  setCityFilter: (city: string) => void;
  handleClearFilters: () => void;
  
  // Sorting actions
  handleSetSortField: (field: string) => void;
  handleSetSortDirection: (direction: string) => void;
  handleSort: (field: SortField) => void;
  
  // Property actions
  handleAction: (action: string, property: Property) => void;
  handleDeleteConfirm: (preserveHistory: boolean) => void;
  
  // Delete dialog actions
  setDeleteDialogOpen: (open: boolean) => void;
  setPropertyToDelete: (property: {id: string, name: string} | null) => void;
}

export function usePropertyTable(options: UsePropertyTableOptions = {}): UsePropertyTableState & UsePropertyTableActions {
  const navigate = useNavigate();
  const { onPropertyDeleted } = options;
  
  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [cityFilter, setCityFilter] = useState("");
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<{id: string, name: string} | null>(null);

  // Type-safe wrapper functions for setting sort field and direction
  const handleSetSortField = useCallback((field: string) => {
    setSortField(field as SortField);
  }, []);
  
  const handleSetSortDirection = useCallback((direction: string) => {
    setSortDirection(direction as SortDirection);
  }, []);

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField]);

  const handleAction = useCallback((action: string, property: Property) => {
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
  }, [navigate]);
  
  const handleDeleteConfirm = useCallback(async (preserveHistory: boolean) => {
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
  }, [propertyToDelete, onPropertyDeleted]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setPropertyType("");
    setCityFilter("");
  }, []);

  return {
    // State
    searchQuery,
    propertyType,
    cityFilter,
    sortField,
    sortDirection,
    deleteDialogOpen,
    propertyToDelete,
    
    // Actions
    setSearchQuery,
    setPropertyType,
    setCityFilter,
    handleSetSortField,
    handleSetSortDirection,
    handleSort,
    handleAction,
    handleDeleteConfirm,
    handleClearFilters,
    setDeleteDialogOpen,
    setPropertyToDelete
  };
}
