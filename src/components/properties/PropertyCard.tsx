
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bed, Bath, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/api-responses";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();
  
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  
  // Get the first image from the property or use default
  let imageUrl = defaultImage;
  if (property.images && property.images.length > 0) {
    const firstImage = property.images[0];
    const imagePath = typeof firstImage === 'string' ? firstImage : (firstImage as any)?.value || '';
    
    // If imagePath starts with '/' it's a server path, otherwise it's an external URL
    imageUrl = imagePath.startsWith('/') 
      ? `${import.meta.env.VITE_API_URL || ''}${imagePath}`
      : imagePath || defaultImage;
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div 
        className="h-48 bg-cover bg-center" 
        style={{ backgroundImage: `url(${imageUrl})` }}
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
          onClick={() => navigate(`/properties/${property._id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
