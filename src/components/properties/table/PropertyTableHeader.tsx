
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyType } from "@/types/enums";

interface PropertyTableHeaderProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  cityFilter: string;
  setCityFilter: (value: string) => void;
  sortField: string;
  sortDirection: string;
  setSortField: (field: string) => void;
  setSortDirection: (direction: string) => void;
}

export function PropertyTableHeader({
  searchQuery,
  setSearchQuery,
  propertyType,
  setPropertyType,
  cityFilter,
  setCityFilter,
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}: PropertyTableHeaderProps) {
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
            setSortField(field);
            setSortDirection(direction);
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
    </div>
  );
}
