
import React from "react";
import { Home, MapPin, Bed, Bath, Users } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/api-responses";

export interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className, ...props }: PropertyCardProps & React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  
  // Always use the first image if available, otherwise use the default
  let imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : defaultImage;
    
  // Fix image URL if it starts with "/https://"
  if (imageUrl.startsWith('/https://')) {
    imageUrl = imageUrl.substring(1); // Remove the leading slash
  }
    
  // Handle both _id and id property formats
  const propertyId = property._id || property.id;

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)} {...props}>
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        onError={(e) => {
          // Fallback to default image if first image fails to load
          (e.target as HTMLDivElement).style.backgroundImage = `url(${defaultImage})`;
        }}
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{property.name}</h3>
          <Badge variant="outline" className="capitalize">
            {property.property_type}
          </Badge>
        </div>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm line-clamp-1">
            {property.address && property.address.city ? 
              `${property.address.city}, ${property.address.state_province || ''}, ${property.address.country || ''}` :
              'Location not specified'}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Sleeps {property.accommodates}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => navigate(`/properties/${propertyId}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
