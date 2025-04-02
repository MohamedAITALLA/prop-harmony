
import React, { useState } from "react";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { Property } from "@/types/api-responses";
import { PropertyType } from "@/types/enums";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AdvancedPagination } from "@/components/ui/advanced-pagination";

export default function Properties() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Use our propertyService to fetch properties
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["properties", currentPage, pageSize],
    queryFn: async () => {
      try {
        // Call the updated API endpoint with pagination
        const response = await propertyService.getAllProperties({
          page: currentPage,
          limit: pageSize
        });
        // Ensure we return an array of properties
        return response.data || getMockProperties();
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
        
        // For demo purposes, return mock data if the API fails
        return {
          properties: getMockProperties(),
          pagination: {
            total: 5,
            page: currentPage,
            limit: pageSize,
            pages: Math.ceil(5 / pageSize),
            has_next_page: currentPage < Math.ceil(5 / pageSize),
            has_previous_page: currentPage > 1
          }
        };
      }
    }
  });

  // Ensure we always have an array of properties
  const properties = data?.properties || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
    has_next_page: false,
    has_previous_page: false
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        
        <Button 
          onClick={() => navigate("/properties/new")}
        >
          <Plus className="mr-2 h-4 w-4" /> New Property
        </Button>
      </div>
      
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
