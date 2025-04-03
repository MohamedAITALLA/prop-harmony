
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { SyncStatusBadge } from "@/components/ui/sync-status-badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Property } from "@/types/api-responses";
import { PropertyType } from "@/types/enums";
import { 
  Eye, 
  Edit, 
  RefreshCw, 
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";
import { propertyService } from "@/services/api-service";
import { DeletePropertyDialog } from "./DeletePropertyDialog";

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

type SortField = "name" | "property_type" | "address.city" | "created_at" | "bookings_count";
type SortDirection = "asc" | "desc";

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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getNestedPropertyValue = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : null;
    }, obj);
  };

  const sortProperties = (a: Property, b: Property) => {
    let valueA, valueB;

    if (sortField === "address.city") {
      valueA = a.address.city.toLowerCase();
      valueB = b.address.city.toLowerCase();
    } else if (sortField === "bookings_count") {
      valueA = a.bookings_count || 0;
      valueB = b.bookings_count || 0;
    } else {
      valueA = getNestedPropertyValue(a, sortField);
      valueB = getNestedPropertyValue(b, sortField);

      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.address.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = propertyType === "" || property.property_type === propertyType;
    
    const matchesCity = 
      cityFilter === "" || 
      property.address.city.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesCity;
  }).sort(sortProperties);

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
      
      toast.success(`Property ${propertyToDelete.name} deleted successfully`, {
        description: preserveHistory 
          ? "Historical data has been preserved for reporting purposes." 
          : "All property data has been permanently deleted."
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

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_types">All types</SelectItem>
            <SelectItem value={PropertyType.APARTMENT}>Apartment</SelectItem>
            <SelectItem value={PropertyType.HOUSE}>House</SelectItem>
            <SelectItem value={PropertyType.VILLA}>Villa</SelectItem>
            <SelectItem value={PropertyType.CONDO}>Condo</SelectItem>
            <SelectItem value={PropertyType.CABIN}>Cabin</SelectItem>
            <SelectItem value={PropertyType.OTHER}>Other</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          placeholder="Filter by city..."
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        />
        
        <Select 
          value={`${sortField}_${sortDirection}`}
          onValueChange={(val) => {
            const [field, direction] = val.split("_");
            setSortField(field as SortField);
            setSortDirection(direction as SortDirection);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name_asc">Name (A-Z)</SelectItem>
            <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            <SelectItem value="created_at_desc">Newest First</SelectItem>
            <SelectItem value="created_at_asc">Oldest First</SelectItem>
            <SelectItem value="property_type_asc">Type (A-Z)</SelectItem>
            <SelectItem value="address.city_asc">Location (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("name")}
              >
                Property Name {renderSortIndicator("name")}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("property_type")}
              >
                Type {renderSortIndicator("property_type")}
              </TableHead>
              <TableHead 
                className="cursor-pointer" 
                onClick={() => handleSort("address.city")}
              >
                Location {renderSortIndicator("address.city")}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort("bookings_count")}
              >
                Active Bookings {renderSortIndicator("bookings_count")}
              </TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell colSpan={6}>
                    <div className="h-8 bg-muted animate-pulse rounded-md"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : filteredProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No properties found matching your filters</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchQuery("");
                        setPropertyType("");
                        setCityFilter("");
                      }}
                    >
                      Clear filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {property.images && property.images.length > 0 ? (
                        <div className="h-8 w-8 rounded overflow-hidden mr-2 bg-muted">
                          <img 
                            src={property.images[0]} 
                            alt={property.name} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded overflow-hidden mr-2 bg-muted flex items-center justify-center">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      {property.name}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{property.property_type}</TableCell>
                  <TableCell>{property.address.city}, {property.address.stateProvince}</TableCell>
                  <TableCell>{property.bookings_count || 0}</TableCell>
                  <TableCell>
                    <SyncStatusBadge 
                      status={property.sync_status || "Not synced"} 
                      lastSync={property.updated_at}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("View", property)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Edit", property)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Sync Now", property)}>
                          <RefreshCw className="h-4 w-4 mr-2" /> Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction("Delete", property)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
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
      
      {!isLoading && filteredProperties.length > 0 && (
        <div className="text-sm text-muted-foreground text-right">
          Showing {filteredProperties.length} of {properties.length} properties
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
