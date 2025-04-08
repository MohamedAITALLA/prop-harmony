
import React from "react";
import { formatDistance } from "date-fns";
import { Bed, Bath, Users, Calendar, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Property } from "@/types/api-responses";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getPropertyTypeColor } from "../utils/propertyTypeUtils";

interface PropertyListCardProps {
  property: Property;
  className?: string;
  onClick?: () => void;
  imageUrl: string;
  timeAgo: string;
}

export function PropertyListCard({ 
  property, 
  className, 
  onClick, 
  imageUrl,
  timeAgo,
  ...props 
}: PropertyListCardProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all hover:shadow-md flex flex-col sm:flex-row cursor-pointer",
        className
      )} 
      onClick={onClick}
      {...props}
    >
      <div 
        className="h-48 sm:h-auto sm:w-48 md:w-56 lg:w-64 bg-cover bg-center flex-shrink-0" 
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      
      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{property.name}</h3>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
              <span className="text-sm line-clamp-1">
                {property.address && property.address.city ? 
                  `${property.address.city}, ${property.address.state_province || ''}, ${property.address.country || ''}` :
                  'Location not specified'}
              </span>
            </div>
          </div>
          
          <Badge className={cn("capitalize", getPropertyTypeColor(property.property_type))}>
            {property.property_type?.toLowerCase()}
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {property.desc || "No description available for this property."}
        </p>
        
        <div className="flex flex-wrap gap-3 mt-auto">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm">Sleeps {property.accommodates}</span>
          </div>
          {property.bookings_count !== undefined && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{property.bookings_count} Bookings</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-muted-foreground">
            Added {timeAgo}
          </div>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick?.();
                    }}
                  >
                    View Details
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View detailed information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </Card>
  );
}
