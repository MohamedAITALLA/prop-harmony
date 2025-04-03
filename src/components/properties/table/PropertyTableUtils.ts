
import { Property } from "@/types/api-responses";

export type SortField = "name" | "property_type" | "address.city" | "created_at" | "bookings_count";
export type SortDirection = "asc" | "desc";

// Helper function to get nested property value
export const getNestedPropertyValue = (obj: any, path: string) => {
  return path.split(".").reduce((prev, curr) => {
    return prev && prev[curr] !== undefined ? prev[curr] : null;
  }, obj);
};

// Helper function to sort properties
export const sortProperties = (properties: Property[], sortField: SortField, sortDirection: SortDirection): Property[] => {
  return [...properties].sort((a, b) => {
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
  });
};

// Helper function to filter properties
export const filterProperties = (
  properties: Property[], 
  searchQuery: string, 
  propertyType: string, 
  cityFilter: string
): Property[] => {
  return properties.filter((property) => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      property.address.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = propertyType === "" || property.property_type === propertyType;
    
    const matchesCity = 
      cityFilter === "" || 
      property.address.city.toLowerCase().includes(cityFilter.toLowerCase());
    
    return matchesSearch && matchesType && matchesCity;
  });
};

// Helper function to render sort indicator
export const renderSortIndicator = (
  currentField: SortField, 
  targetField: SortField, 
  sortDirection: SortDirection,
  ChevronUp: React.ElementType,
  ChevronDown: React.ElementType
) => {
  if (currentField !== targetField) return null;
  
  return sortDirection === "asc" ? 
    <ChevronUp className="h-4 w-4 inline ml-1" /> : 
    <ChevronDown className="h-4 w-4 inline ml-1" />;
};
