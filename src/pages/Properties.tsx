
import React, { useState } from "react";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/api-service";
import { Property } from "@/types/api-responses";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Properties() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Use our propertyService to fetch properties
  const { data, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      try {
        // In a production app, this would use the real API
        const response = await propertyService.getAllProperties();
        return response.data.properties;
      } catch (error) {
        console.error("Error fetching properties:", error);
        
        // For demo purposes, return mock data if the API fails
        return [
          {
            id: "1",
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
            updated_at: new Date().toISOString()
          },
          {
            id: "2",
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
            updated_at: new Date().toISOString()
          },
          {
            id: "3",
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
            updated_at: new Date().toISOString()
          },
          {
            id: "4",
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
            updated_at: new Date().toISOString()
          },
          {
            id: "5",
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
            updated_at: new Date().toISOString()
          },
        ] as Property[];
      }
    }
  });

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
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="mt-6">
          <PropertyList properties={data || []} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="table" className="mt-6">
          <PropertyTable properties={data || []} isLoading={isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
