
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "../properties/PropertyCard";
import { Property } from "@/types/api-responses";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ensureMongoIds } from "@/lib/mongo-helpers";
import { convertToMongoIdFormat } from "@/lib/id-conversion";
import { PropertyType } from "@/types/enums";

interface PropertyCardsProps {
  limit?: number;
  action?: string;
}

export function PropertyCards({ limit = 3, action }: PropertyCardsProps) {
  const navigate = useNavigate();
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["properties", "recent"],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // This is mock data for now
      const mockData = [
        {
          _id: "prop-1",
          name: "Beachfront Villa",
          property_type: PropertyType.VILLA,
          address: {
            street: "123 Ocean Drive",
            city: "Malibu",
            state_province: "CA",
            postal_code: "90210",
            country: "USA"
          },
          bedrooms: 4,
          bathrooms: 3.5,
          beds: 4,
          accommodates: 8,
          desc: "Stunning beachfront villa with amazing views",
          images: ["https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          _id: "prop-2",
          name: "Mountain Cabin",
          property_type: PropertyType.CABIN,
          address: {
            street: "45 Pine Road",
            city: "Aspen",
            state_province: "CO",
            postal_code: "81611",
            country: "USA"
          },
          bedrooms: 2,
          bathrooms: 1,
          beds: 2,
          accommodates: 4,
          desc: "Cozy mountain cabin in a scenic location",
          images: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?q=80&w=800&auto=format&fit=crop"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          _id: "prop-3",
          name: "Downtown Apartment",
          property_type: PropertyType.APARTMENT,
          address: {
            street: "789 Broadway",
            city: "New York",
            state_province: "NY",
            postal_code: "10003",
            country: "USA"
          },
          bedrooms: 1,
          bathrooms: 1,
          beds: 1,
          accommodates: 2,
          desc: "Modern downtown apartment in the heart of the city",
          images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop"],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as Property[];

      return convertToMongoIdFormat(mockData) as Property[];
    },
  });

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-[300px] bg-muted rounded-md animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, limit).map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          
          {action && (
            <div className="flex justify-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => navigate("/properties")}
                className="gap-2"
              >
                {action}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
