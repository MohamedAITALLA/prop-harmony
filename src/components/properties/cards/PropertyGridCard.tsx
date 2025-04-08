
import React from "react";
import { format } from "date-fns";
import { Bed, Bath, Users, ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Property } from "@/types/api-responses";
import { getPropertyTypeColor } from "../utils/propertyTypeUtils";

interface PropertyGridCardProps {
  property: Property;
  className?: string;
  onClick?: () => void;
  imageUrl: string;
  createdDate: Date | null;
}

export function PropertyGridCard({ 
  property, 
  className, 
  onClick, 
  imageUrl,
  createdDate,
  ...props 
}: PropertyGridCardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] cursor-pointer", 
        className
      )} 
      onClick={onClick}
      {...props}
    >
      <div className="relative">
        <div 
          className="h-48 bg-cover bg-center" 
          style={{ 
            backgroundImage: `url(${imageUrl})`,
          }}
        ></div>
        
        <Badge 
          className={cn(
            "absolute top-3 right-3 capitalize", 
            getPropertyTypeColor(property.property_type)
          )}
        >
          {property.property_type?.toLowerCase()}
        </Badge>
        
        {property.days_since_creation !== undefined && property.days_since_creation < 7 && (
          <Badge 
            variant="default" 
            className="absolute top-3 left-3 bg-primary/90 hover:bg-primary"
          >
            New
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-medium text-lg line-clamp-1">{property.name}</h3>
          
          {property.rating && (
            <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-xs px-1.5 py-0.5 rounded">
              <Star className="h-3 w-3 mr-0.5 fill-current" />
              <span>{property.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-muted-foreground mb-3">
          <span className="text-sm line-clamp-1">
            {property.address && property.address.city ? 
              `${property.address.city}, ${property.address.state_province || ''}` :
              'Location not specified'}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 dark:bg-gray-900 rounded">
            <Bed className="h-4 w-4 mb-1 text-gray-500" />
            <span className="font-medium">{property.bedrooms}</span>
            <span className="text-xs text-muted-foreground">{property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 dark:bg-gray-900 rounded">
            <Bath className="h-4 w-4 mb-1 text-gray-500" />
            <span className="font-medium">{property.bathrooms}</span>
            <span className="text-xs text-muted-foreground">{property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          <div className="flex flex-col items-center justify-center p-1.5 bg-gray-50 dark:bg-gray-900 rounded">
            <Users className="h-4 w-4 mb-1 text-gray-500" />
            <span className="font-medium">{property.accommodates}</span>
            <span className="text-xs text-muted-foreground">Guests</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t flex justify-between items-center">
        <div className="text-xs text-muted-foreground">
          {createdDate && format(createdDate, "MMM d, yyyy")}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-3 hover:bg-white dark:hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Details
        </Button>
      </CardFooter>
    </Card>
  );
}
