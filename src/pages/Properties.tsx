
import { PropertyList } from "@/components/properties/PropertyList";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface Property {
  id: string;
  name: string;
  propertyType: string;
  address: {
    city: string;
    stateProvince: string;
    country: string;
  };
  bedrooms: number;
  bathrooms: number;
  accommodates: number;
  images?: string[];
}

export default function Properties() {
  // This is a mock query that would normally fetch data from your API
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      // In a real app, you would fetch this data from your API
      // const response = await api.get("/properties");
      // return response.data;
      
      // Mock data for now
      return [
        {
          id: "1",
          name: "Oceanfront Villa",
          propertyType: "villa",
          address: {
            city: "Malibu",
            stateProvince: "California",
            country: "USA"
          },
          bedrooms: 4,
          bathrooms: 3.5,
          accommodates: 8,
          images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop"]
        },
        {
          id: "2",
          name: "Downtown Loft",
          propertyType: "apartment",
          address: {
            city: "New York",
            stateProvince: "New York",
            country: "USA"
          },
          bedrooms: 2,
          bathrooms: 2,
          accommodates: 4,
          images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop"]
        },
        {
          id: "3",
          name: "Mountain Cabin",
          propertyType: "cabin",
          address: {
            city: "Aspen",
            stateProvince: "Colorado",
            country: "USA"
          },
          bedrooms: 3,
          bathrooms: 2,
          accommodates: 6,
          images: ["https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=800&auto=format&fit=crop"]
        },
        {
          id: "4",
          name: "Beachside Condo",
          propertyType: "condo",
          address: {
            city: "Miami",
            stateProvince: "Florida",
            country: "USA"
          },
          bedrooms: 2,
          bathrooms: 2,
          accommodates: 4,
          images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&auto=format&fit=crop"]
        },
        {
          id: "5",
          name: "Suburban House",
          propertyType: "house",
          address: {
            city: "Austin",
            stateProvince: "Texas",
            country: "USA"
          },
          bedrooms: 4,
          bathrooms: 3,
          accommodates: 7,
          images: ["https://images.unsplash.com/photo-1593604572577-1c6c41a146ae?q=80&w=800&auto=format&fit=crop"]
        },
      ] as Property[];
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">
          Manage your property portfolio
        </p>
      </div>
      
      <PropertyList properties={properties || []} isLoading={isLoading} />
    </div>
  );
}
