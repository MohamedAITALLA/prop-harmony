import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Image } from 'lucide-react';
import { Property } from '@/types/api-responses';
import { useQuery } from '@tanstack/react-query';
import { propertyService } from '@/services/api-service';
import { getPropertyImageUrl } from '@/components/properties/utils/imageUtils';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

function PropertyCard({ property, onClick }: PropertyCardProps) {
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  
  const imageUrl = getPropertyImageUrl(property.images, defaultImage);
  
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <div className="h-32 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={`${property.name}`}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImage;
            }}
          />
        </div>
      </div>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base font-medium line-clamp-1">{property.name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {property.address ? `${property.address.city || ''}, ${property.address.state_province || ''}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <div className="flex items-center space-x-2 text-sm">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{property.property_type?.toLowerCase() || "Property"}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export interface PropertyCardsProps {
  properties?: Property[];
  isLoading: boolean;
  error: any;
  limit?: number;
  action?: string;
}

export function PropertyCards({ properties, isLoading, error, limit, action }: PropertyCardsProps) {
  const navigate = useNavigate();

  const { data: fetchedProperties = [], isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ['properties', 'dashboard'],
    queryFn: async () => {
      try {
        const response = await propertyService.getAllProperties();
        return response.data.properties;
      } catch (error) {
        console.error("Falling back to mock data:", error);
        return [
          {
            id: '1',
            name: 'Beach House',
            property_type: 'House' as any,
            desc: 'A beautiful beach house',
            accommodates: 6,
            bedrooms: 3,
            beds: 3,
            bathrooms: 2,
            images: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            address: { 
              street: '123 Beach St', 
              city: 'Miami', 
              state_province: 'FL',
              postal_code: '33139',
              country: 'USA'
            }
          },
          {
            id: '2',
            name: 'Mountain Cabin',
            property_type: 'Cabin' as any,
            desc: 'Cozy mountain retreat',
            accommodates: 4,
            bedrooms: 2,
            beds: 2,
            bathrooms: 1,
            images: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            address: { 
              street: '456 Mountain Rd', 
              city: 'Aspen', 
              state_province: 'CO',
              postal_code: '81611',
              country: 'USA'
            }
          },
          {
            id: '3',
            name: 'Downtown Loft',
            property_type: 'Apartment' as any,
            desc: 'Modern downtown loft',
            accommodates: 2,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
            images: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            address: { 
              street: '789 City Ave', 
              city: 'New York', 
              state_province: 'NY',
              postal_code: '10001',
              country: 'USA'
            }
          }
        ] as Property[];
      }
    },
    enabled: !properties && !isLoading
  });

  const displayProperties = properties || fetchedProperties;
  
  const limitedProperties = limit && displayProperties ? displayProperties.slice(0, limit) : displayProperties;
  
  const isLoadingData = isLoading || isFetching;
  const errorData = error || fetchError;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoadingData ? (
        <>
          {Array(limit || 3).fill(null).map((_, index) => (
            <Card key={index}>
              <div className="h-32 w-full bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
                <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </>
      ) : errorData ? (
        <div className="text-red-500">Error loading properties.</div>
      ) : limitedProperties && limitedProperties.length > 0 ? (
        limitedProperties.map((property) => (
          <PropertyCard 
            key={property.id || property._id} 
            property={property}
            onClick={() => navigate(`/properties/${property.id || property._id}`)}
          />
        ))
      ) : (
        <div className="text-muted-foreground">No properties found.</div>
      )}
    </div>
  );
}
