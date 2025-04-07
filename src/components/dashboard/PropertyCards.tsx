import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Home } from 'lucide-react';
import { Property } from '@/types/api-responses';

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

function PropertyCard({ property, onClick }: PropertyCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <CardTitle>{property.name}</CardTitle>
        <CardDescription>{property.address}</CardDescription>
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

interface PropertyCardsProps {
  properties?: Property[];
  isLoading: boolean;
  error: any;
}

export function PropertyCards({ properties, isLoading, error }: PropertyCardsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {isLoading ? (
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
      ) : error ? (
        <div className="text-red-500">Error loading properties.</div>
      ) : properties && properties.length > 0 ? (
        properties.map((property) => (
          <PropertyCard 
            key={property.id} 
            property={property}
            onClick={() => navigate(`/properties/${property.id}`)}
          />
        ))
      ) : (
        <div className="text-muted-foreground">No properties found.</div>
      )}
    </div>
  );
}
