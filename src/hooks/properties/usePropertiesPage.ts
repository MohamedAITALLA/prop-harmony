
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { toast } from "sonner";
import { PropertyType } from "@/types/enums";

export const usePropertiesPage = () => {
  // State for filters
  const [propertyType, setPropertyType] = useState<string>("all");
  const [city, setCity] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortOption, setSortOption] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Generate query parameters
  const getQueryParams = useCallback(() => {
    const params: any = {
      page,
      limit,
    };

    if (propertyType !== "all") {
      params.property_type = propertyType;
    }

    if (city) {
      params.city = city;
    }

    // Map sortOption to API-compliant sort format (field:direction)
    if (sortOption === "newest") {
      params.sort = "created_at:desc";
    } else if (sortOption === "oldest") {
      params.sort = "created_at:asc";
    } else if (sortOption === "name_asc") {
      params.sort = "name:asc";
    } else if (sortOption === "name_desc") {
      params.sort = "name:desc";
    } else if (sortOption === "most_bookings") {
      params.sort = "bookings_count:desc";
    }

    return params;
  }, [page, limit, propertyType, city, sortOption]);

  // Fetch properties
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["properties", getQueryParams()],
    queryFn: async () => {
      const response = await propertyService.getAllProperties(getQueryParams());
      return response;
    },
  });

  // Reset filters
  const handleFilterReset = useCallback(() => {
    setPropertyType("all");
    setCity("");
    setSortOption("newest");
    setIsFilterOpen(false);
    setPage(1);
  }, []);

  // Refresh properties
  const handleRefresh = useCallback(() => {
    refetch();
    toast.success("Properties refreshed");
  }, [refetch]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Handle property deletion
  const handlePropertyDeleted = useCallback((propertyId: string) => {
    refetch();
    toast.success("Property deleted successfully");
  }, [refetch]);

  // Extract properties and pagination
  const properties = data?.data?.properties || [];
  const pagination = data?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
    has_next_page: false,
    has_previous_page: false,
  };

  // Get summary data, if available
  const summary = data?.data?.summary || {
    total_properties: properties.length,
    by_property_type: {},
    by_city: {},
    applied_filters: { property_type: propertyType, city }
  };

  // Get property type label
  const getPropertyTypeLabel = useCallback((type: string) => {
    switch (type) {
      case PropertyType.VILLA:
        return "Villa";
      case PropertyType.APARTMENT:
        return "Apartment";
      case PropertyType.CABIN:
        return "Cabin";
      case PropertyType.CONDO:
        return "Condo";
      case PropertyType.HOUSE:
        return "House";
      case PropertyType.HOTEL:
        return "Hotel";
      case PropertyType.ROOM:
        return "Room";
      case PropertyType.OTHER:
        return "Other";
      default:
        return type;
    }
  }, []);

  return {
    properties,
    pagination,
    summary,
    isLoading,
    error,
    viewMode,
    setViewMode,
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
    getPropertyTypeLabel,
  };
};
