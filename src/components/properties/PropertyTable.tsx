
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
import { Property, PropertyType } from "@/types/api-responses";
import { 
  Eye, 
  Edit, 
  RefreshCw, 
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreVertical
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface PropertyTableProps {
  properties: Property[];
  isLoading?: boolean;
}

type SortField = "name" | "property_type" | "address.city" | "created_at" | "bookings_count";
type SortDirection = "asc" | "desc";

export function PropertyTable({ properties, isLoading = false }: PropertyTableProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const [cityFilter, setCityFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Function to handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Function to get nested property value
  const getNestedPropertyValue = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : null;
    }, obj);
  };

  // Sort function
  const sortProperties = (a: Property, b: Property) => {
    let valueA, valueB;

    if (sortField === "address.city") {
      valueA = a.address.city.toLowerCase();
      valueB = b.address.city.toLowerCase();
    } else if (sortField === "bookings_count") {
      // Placeholder since we don't have this property in our model yet
      valueA = 0;
      valueB = 0;
    } else {
      valueA = getNestedPropertyValue(a, sortField);
      valueB = getNestedPropertyValue(b, sortField);

      // Convert to lowercase if string
      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      if (typeof valueB === "string") valueB = valueB.toLowerCase();
    }

    if (sortDirection === "asc") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  };

  // Filter function
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

  // Function to handle action clicks
  const handleAction = (action: string, propertyId: string) => {
    switch (action) {
      case "View":
        navigate(`/properties/${propertyId}`);
        break;
      case "Edit":
        navigate(`/properties/${propertyId}/edit`);
        break;
      case "Sync Now":
        // Implement sync functionality
        console.log(`Syncing property ${propertyId}`);
        break;
      case "Delete":
        // Implement delete functionality
        console.log(`Deleting property ${propertyId}`);
        break;
    }
  };

  // Function to render sort indicator
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All types</SelectItem>
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
      </div>

      <div>
        <Select 
          value={`${sortField}_${sortDirection}`}
          onValueChange={(val) => {
            const [field, direction] = val.split("_");
            setSortField(field as SortField);
            setSortDirection(direction as SortDirection);
          }}
        >
          <SelectTrigger className="w-[200px]">
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

      {/* Table */}
      <div className="border rounded-md">
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
              <TableHead>Active Bookings</TableHead>
              <TableHead>Sync Status</TableHead>
              <TableHead>Actions</TableHead>
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
                  No properties found matching your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">{property.name}</TableCell>
                  <TableCell className="capitalize">{property.property_type}</TableCell>
                  <TableCell>{property.address.city}, {property.address.stateProvince}</TableCell>
                  <TableCell>0</TableCell> {/* Placeholder for bookings count */}
                  <TableCell>
                    <StatusBadge status="Active" />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleAction("View", property.id)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Edit", property.id)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("Sync Now", property.id)}>
                          <RefreshCw className="h-4 w-4 mr-2" /> Sync Now
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleAction("Delete", property.id)}
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
    </div>
  );
}
