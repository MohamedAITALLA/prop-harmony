
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { Property } from "@/types/api-responses";
import { toast } from "sonner";

export function usePropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [propertyType, setPropertyType] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use our propertyService to fetch properties
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["properties", currentPage, pageSize, propertyType, city, sortOption],
    queryFn: async () => {
      try {
        // Call the updated API endpoint with pagination
        const response = await propertyService.getAllProperties({
          page: currentPage,
          limit: pageSize,
          property_type: propertyType,
          city: city,
          sort: sortOption
        });
        
        console.log("API Response:", response);
        
        if (response?.success === false) {
          throw new Error(response?.message || "Failed to fetch properties");
        }
        
        // Return the response data or mock data if needed
        return response || { properties: getMockProperties(), pagination: createMockPagination() };
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
        
        // For demo purposes, return mock data if the API fails
        return {
          properties: getMockProperties(),
          pagination: createMockPagination(),
          summary: {
            total_properties: 5,
            by_property_type: {},
            by_city: {},
            applied_filters: {
              property_type: propertyType || '',
              city: city || '',
              sort: sortOption || '',
            }
          }
        };
      }
    }
  });

  function createMockPagination() {
    return {
      total: 5,
      page: currentPage,
      limit: pageSize,
      pages: Math.ceil(5 / pageSize),
      has_next_page: currentPage < Math.ceil(5 / pageSize),
      has_previous_page: currentPage > 1
    };
  }

  // Extract properties and pagination from the response
  let properties: Property[] = [];
  let pagination = {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
    has_next_page: false,
    has_previous_page: false
  };

  if (data) {
    if (data.data && data.data.properties) {
      // API returned the correct structure
      properties = data.data.properties;
      pagination = data.data.pagination || pagination;
    } else if (data.properties) {
      // Direct properties field
      properties = data.properties;
      pagination = data.pagination || pagination;
    } else if (Array.isArray(data)) {
      // Array of properties
      properties = data;
      pagination = createMockPagination();
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleFilterReset = () => {
    setPropertyType("");
    setCity("");
    setSortOption("");
  };
  
  const handleRefresh = () => {
    refetch();
    toast.success("Properties refreshed");
  };
  
  const handlePropertyDeleted = (propertyId: string) => {
    // Refresh the properties list after deletion
    refetch();
  };

  return {
    properties,
    pagination,
    isLoading,
    error,
    viewMode,
    setViewMode,
    currentPage,
    propertyType,
    setPropertyType,
    city,
    setCity,
    sortOption,
    setSortOption,
    isFilterOpen,
    setIsFilterOpen,
    handlePageChange,
    handleFilterReset,
    handleRefresh,
    handlePropertyDeleted,
  };
}

// Mock data function for development purposes
function getMockProperties(): Property[] {
  return [
    {
      _id: "1",
      name: "Oceanfront Villa",
      property_type: "villa",
      address: {
        city: "Malibu",
        stateProvince: "California",
        country: "USA"
      },
      bedrooms: 4,
      bathrooms: 3.5,
      beds: 5,
      accommodates: 8,
      amenities: {},
      policies: {},
      images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: "synced",
      bookings_count: 2
    },
    {
      _id: "2",
      name: "Downtown Loft",
      property_type: "apartment",
      address: {
        city: "New York",
        stateProvince: "New York",
        country: "USA"
      },
      bedrooms: 2,
      bathrooms: 2,
      beds: 2,
      accommodates: 4,
      amenities: {},
      policies: {},
      images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: "partial",
      bookings_count: 1
    },
    {
      _id: "3",
      name: "Mountain Cabin",
      property_type: "cabin",
      address: {
        city: "Aspen",
        stateProvince: "Colorado",
        country: "USA"
      },
      bedrooms: 3,
      bathrooms: 2,
      beds: 3,
      accommodates: 6,
      amenities: {},
      policies: {},
      images: ["https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: "failed",
      bookings_count: 0
    },
    {
      _id: "4",
      name: "Beachside Condo",
      property_type: "condo",
      address: {
        city: "Miami",
        stateProvince: "Florida",
        country: "USA"
      },
      bedrooms: 2,
      bathrooms: 2,
      beds: 2,
      accommodates: 4,
      amenities: {},
      policies: {},
      images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: "synced",
      bookings_count: 3
    },
    {
      _id: "5",
      name: "Suburban House",
      property_type: "house",
      address: {
        city: "Austin",
        stateProvince: "Texas",
        country: "USA"
      },
      bedrooms: 4,
      bathrooms: 3,
      beds: 4,
      accommodates: 7,
      amenities: {},
      policies: {},
      images: ["https://images.unsplash.com/photo-1593604572577-1c6c41a146ae?q=80&w=800&auto=format&fit=crop"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: "pending",
      bookings_count: 0
    },
  ];
}
