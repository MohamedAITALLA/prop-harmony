
import React, { useState } from "react";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { Property } from "@/types/api-responses";
import { PropertyType } from "@/types/enums";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Grid, 
  List, 
  Filter, 
  SortAsc, 
  ArrowUpDown,
  X,
  RefreshCw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function Properties() {
  const navigate = useNavigate();
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

  const activeFiltersCount = [propertyType, city, sortOption].filter(Boolean).length;

  if (error) {
    return (
      <div className="py-8 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">Failed to load properties</h2>
        <p className="text-muted-foreground mb-4">There was an error loading your properties.</p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">
            Manage your property portfolio
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            title="Refresh properties"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isFilterOpen ? "secondary" : "outline"}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" /> 
            Filter
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <Button 
            onClick={() => navigate("/properties/new")}
          >
            <Plus className="mr-2 h-4 w-4" /> New Property
          </Button>
        </div>
      </div>
      
      {isFilterOpen && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="property-type" className="text-sm font-medium block mb-2">Property Type</label>
                <Select 
                  value={propertyType} 
                  onValueChange={setPropertyType}
                >
                  <SelectTrigger id="property-type">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    {Object.values(PropertyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="city" className="text-sm font-medium block mb-2">City</label>
                <Input
                  id="city"
                  placeholder="Filter by city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="sort" className="text-sm font-medium block mb-2">Sort By</label>
                <Select 
                  value={sortOption} 
                  onValueChange={setSortOption}
                >
                  <SelectTrigger id="sort">
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Default</SelectItem>
                    <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                    <SelectItem value="created_desc">Newest First</SelectItem>
                    <SelectItem value="created_asc">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleFilterReset}
                  className="gap-2"
                >
                  <X className="h-4 w-4" /> Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="grid" onValueChange={(value) => setViewMode(value as "grid" | "table")}>
        <TabsList>
          <TabsTrigger value="grid">
            <Grid className="h-4 w-4 mr-2" /> Grid View
          </TabsTrigger>
          <TabsTrigger value="table">
            <List className="h-4 w-4 mr-2" /> Table View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-6">
          <PropertyList properties={properties} isLoading={isLoading} />
          <div className="flex justify-center mt-4">
            <AdvancedPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>
        <TabsContent value="table" className="mt-6">
          <PropertyTable properties={properties} isLoading={isLoading} />
          <div className="flex justify-center mt-4">
            <AdvancedPagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={handlePageChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock data function for development purposes
function getMockProperties(): Property[] {
  return [
    {
      _id: "1",
      name: "Oceanfront Villa",
      property_type: PropertyType.VILLA,
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
      property_type: PropertyType.APARTMENT,
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
      property_type: PropertyType.CABIN,
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
      property_type: PropertyType.CONDO,
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
      property_type: PropertyType.HOUSE,
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
