
import React from 'react';
import { Property } from "@/types/api-responses";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, MapPin, Users, Bed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPropertyImageUrl } from "../utils/imageUtils";

interface PropertyCardProps {
  property: Property;
  onClick: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  // Get image URL using the utility function - same as dashboard
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  const imageUrl = getPropertyImageUrl(property.images, defaultImage);

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer group" onClick={onClick}>
      <div className="relative h-40 bg-muted overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.name} 
          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />
        <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm">
          {property.property_type}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
          {property.name}
        </h3>
        
        <div className="mt-2 flex items-center text-muted-foreground text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground/70" />
          <span className="line-clamp-1">
            {property.address?.city}, {property.address?.country}
          </span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{property.accommodates || 0} guests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bed className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span>{property.bedrooms || 0} bedrooms</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 text-muted-foreground hover:text-primary hover:bg-primary/5"
          onClick={(e) => {
            e.stopPropagation();
            // Here you could navigate directly to calendar view
          }}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Calendar</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
