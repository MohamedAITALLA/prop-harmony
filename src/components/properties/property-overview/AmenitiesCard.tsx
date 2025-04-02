
import React from "react";
import { Wifi, ChefHat, Wind, Flame, Tv, Loader, Trash, Car, ArrowUpDown, Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { renderAmenity } from "./helpers";

interface AmenitiesCardProps {
  property: Property;
}

export function AmenitiesCard({ property }: AmenitiesCardProps) {
  // Only render if amenities exist
  if (!property.amenities || Object.keys(property.amenities).length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm border-border/40">
      <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          Amenities
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {renderAmenity("WiFi", property.amenities.wifi, <Wifi className="h-4 w-4" />)}
          {renderAmenity("Kitchen", property.amenities.kitchen, <ChefHat className="h-4 w-4" />)}
          {renderAmenity("Air Conditioning", property.amenities.ac, <Wind className="h-4 w-4" />)}
          {renderAmenity("Heating", property.amenities.heating, <Flame className="h-4 w-4" />)}
          {renderAmenity("TV", property.amenities.tv, <Tv className="h-4 w-4" />)}
          {renderAmenity("Washer", property.amenities.washer, <Loader className="h-4 w-4" />)}
          {renderAmenity("Dryer", property.amenities.dryer, <Trash className="h-4 w-4" />)}
          {renderAmenity("Parking", property.amenities.parking, <Car className="h-4 w-4" />)}
          {renderAmenity("Elevator", property.amenities.elevator, <ArrowUpDown className="h-4 w-4" />)}
          {renderAmenity("Pool", property.amenities.pool, <Droplets className="h-4 w-4" />)}
        </div>
      </CardContent>
    </Card>
  );
}
