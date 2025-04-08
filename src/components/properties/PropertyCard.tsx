
import React from "react";
import { Home, MapPin, Bed, Bath, Users, Calendar, ExternalLink, Star, TrendingUp } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Property } from "@/types/api-responses";
import { format, formatDistance } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface PropertyCardProps {
  property: Property;
  viewMode?: "grid" | "list";
  className?: string;
  onClick?: () => void;
}

export function PropertyCard({ property, viewMode = "grid", className, onClick, ...props }: PropertyCardProps & React.HTMLAttributes<HTMLDivElement>) {
  // Get a clean image URL
  const defaultImage = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop";
  
  let imageUrl = property.images && property.images.length > 0 
    ? property.images[0] 
    : defaultImage;
    
  // Fix image URL if it starts with "/https://"
  if (imageUrl.startsWith('/https://')) {
    imageUrl = imageUrl.substring(1);
  }
  
  // Format the creation date
  const createdDate = property.created_at ? new Date(property.created_at) : null;
  const timeAgo = createdDate ? formatDistance(createdDate, new Date(), { addSuffix: true }) : "Unknown date";
  
  const propertyTypeColor = () => {
    switch (property.property_type) {
      case 'APARTMENT':
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 'HOUSE':
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case 'VILLA':
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case 'CABIN':
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      case 'HOTEL':
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case 'CONDO':
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case 'ROOM':
        return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Handle different view modes (grid or list)
  if (viewMode === "list") {
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
            
            <Badge className={cn("capitalize", propertyTypeColor())}>
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

  // Default grid view
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
          onError={(e) => {
            // Fallback to default image if first image fails to load
            (e.target as HTMLDivElement).style.backgroundImage = `url(${defaultImage})`;
          }}
        ></div>
        
        <Badge 
          className={cn(
            "absolute top-3 right-3 capitalize", 
            propertyTypeColor()
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
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
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
