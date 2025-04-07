
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from 'lucide-react';
import { Property } from '@/types/api-responses';
import { useQuery } from '@tanstack/react-query';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <CardDescription>
          {property.address ? `${property.address.city || ''}, ${property.address.state_province || ''}` : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span>{property.property_type}</span>
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

  // If no properties are provided, fetch them
  const { data: fetchedProperties = [], isLoading: isFetching, error: fetchError } = useQuery({
    queryKey: ['properties', 'dashboard'],
    queryFn: async () => {
      // Mock data for now
      return [
        {
          id: '1',
          name: 'Beach House',
          property_type: 'House',
          address: { city: 'Miami', state_province: 'FL' }
        },
        {
          id: '2',
          name: 'Mountain Cabin',
          property_type: 'Cabin',
          address: { city: 'Aspen', state_province: 'CO' }
        },
        {
          id: '3',
          name: 'Downtown Loft',
          property_type: 'Apartment',
          address: { city: 'New York', state_province: 'NY' }
        }
      ] as Property[];
    },
    enabled: !properties && !isLoading // Only fetch if properties aren't provided
  });

  // Use provided properties or fetched properties
  const displayProperties = properties || fetchedProperties;
  
  // If limit is specified, slice the properties array
  const limitedProperties = limit && displayProperties ? displayProperties.slice(0, limit) : displayProperties;
  
  // Combined loading and error states
  const isLoadingData = isLoading || isFetching;
  const errorData = error || fetchError;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoadingData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-5 w-40" /></CardTitle>
              <CardDescription><Skeleton className="h-4 w-60" /></CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
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
