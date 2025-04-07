
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Property } from "@/types/api-responses";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";
import { propertyService } from "@/services/property-service";
import { DeletePropertyDialog } from "./DeletePropertyDialog";
import { PropertyTableHeader } from "./table/PropertyTableHeader";
import { PropertyTableRow } from "./table/PropertyTableRow";
import { PropertyEmptyState } from "./table/PropertyEmptyState";
import { PropertyLoadingSkeleton } from "./table/PropertyLoadingSkeleton";
import { 
  SortField, 
  SortDirection,
  filterProperties,
  sortProperties,
  renderSortIndicator
} from "./table/PropertyTableUtils";

export interface PropertyTableProps {
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

export function PropertyTable({ 
  properties, 
  isLoading = false,
  pagination,
  onPageChange,
  onPropertyDeleted
}: PropertyTableProps) {
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

  const filteredProperties = filterProperties(properties, searchQuery, propertyType, cityFilter);
  const sortedProperties = sortProperties(filteredProperties, sortField, sortDirection);

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
    </div>
  );
}
