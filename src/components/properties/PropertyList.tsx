
import { PropertyCard } from "./PropertyCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/api-responses";
import { PropertyType } from "@/types/enums";

interface PropertyListProps {
  properties: Property[];
  isLoading: boolean;
}

export function PropertyList({ properties = [], isLoading }: PropertyListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [propertyType, setPropertyType] = useState<string>("");
  const navigate = useNavigate();

  // Ensure properties is an array before filtering
  const propertiesToFilter = Array.isArray(properties) ? properties : [];
  
  // Simple filter function
  const filteredProperties = propertiesToFilter.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (property.address.city && property.address.city.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = propertyType === "" || property.property_type === propertyType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:w-3/4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Property type" />
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
        </div>
        
        <Button 
          onClick={() => navigate("/properties/new")} 
          className="w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> New Property
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[300px] bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-2">
            {searchQuery || propertyType 
              ? "Try adjusting your search or filters"
              : "Add your first property to get started"}
          </p>
          {!searchQuery && !propertyType && (
            <Button 
              onClick={() => navigate("/properties/new")} 
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Property
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
