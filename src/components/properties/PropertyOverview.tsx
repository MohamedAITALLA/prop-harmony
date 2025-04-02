
import React from "react";
import { 
  Home, Users, Bed, Bath, LogIn, LogOut, Calendar, Ban, AlertCircle, 
  Wifi, ChefHat, Wind, Flame, Tv, Loader, Trash, Car, ArrowUpDown, Droplets,
  MapPin, MapPinned, Building, BuildingIcon, DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types/api-responses";
import { cn } from "@/lib/utils";

export interface PropertyOverviewProps {
  property: Property;
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  // Helper function to render items with icons
  const renderIconItem = (label: string, value: React.ReactNode, icon: React.ReactNode) => {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
    );
  };

  // Helper function for boolean amenities
  const renderAmenity = (name: string, value: boolean, icon: React.ReactNode) => {
    return (
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-all",
        value ? "bg-primary/10" : "bg-muted/30 opacity-60"
      )}>
        <div className={cn(
          "rounded-full p-2",
          value ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
        <span className={value ? "font-medium" : ""}>{name}</span>
        {value ? (
          <span className="ml-auto text-green-600 text-sm">✓</span>
        ) : (
          <span className="ml-auto text-gray-400 text-sm">✗</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm border-border/40">
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BuildingIcon className="h-5 w-5 text-primary" />
              Property Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-4">
              {renderIconItem("Type", property.property_type, <Home className="h-4 w-4" />)}
              {renderIconItem("Accommodates", `${property.accommodates} guests`, <Users className="h-4 w-4" />)}
              {property.price_per_night && renderIconItem("Price", `$${property.price_per_night}/night`, <DollarSign className="h-4 w-4" />)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" />
              Rooms
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-4">
              {renderIconItem("Bedrooms", property.bedrooms, <Bed className="h-4 w-4" />)}
              {renderIconItem("Beds", property.beds || '-', <Bed className="h-4 w-4" />)}
              {renderIconItem("Bathrooms", property.bathrooms, <Bath className="h-4 w-4" />)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/40">
          <CardHeader className="bg-muted/30 pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="font-medium">{property.address.city}, {property.address.country}</p>
            {property.address.street && <p className="text-muted-foreground text-sm">{property.address.street}</p>}
            {property.address.stateProvince && <p className="text-muted-foreground text-sm">{property.address.stateProvince}</p>}
            {property.address.postalCode && <p className="text-muted-foreground text-sm">Postal Code: {property.address.postalCode}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Address */}
      <Card className="shadow-sm border-border/40">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-xl flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-primary" />
            Address Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {property.address.street && (
                <p><span className="text-muted-foreground">Street:</span> {property.address.street}</p>
              )}
              <p><span className="text-muted-foreground">City:</span> {property.address.city}</p>
              {property.address.stateProvince && (
                <p><span className="text-muted-foreground">State/Province:</span> {property.address.stateProvince}</p>
              )}
              {property.address.postalCode && (
                <p><span className="text-muted-foreground">Postal Code:</span> {property.address.postalCode}</p>
              )}
              <p><span className="text-muted-foreground">Country:</span> {property.address.country}</p>
            </div>
            
            {/* Map placeholder */}
            {property.address.coordinates && (
              <div className="bg-muted h-48 rounded-md flex flex-col items-center justify-center border border-dashed border-border">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <p className="text-muted-foreground">Map will be displayed here</p>
                <p className="text-xs text-muted-foreground mt-2">
                  ({property.address.coordinates.latitude}, {property.address.coordinates.longitude})
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      {property.amenities && Object.keys(property.amenities).length > 0 && (
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
      )}

      {/* Policies */}
      {property.policies && Object.keys(property.policies).length > 0 && (
        <Card className="shadow-sm border-border/40">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {property.policies.check_in_time && 
                renderIconItem("Check-in Time", property.policies.check_in_time, <LogIn className="h-4 w-4" />)}
              {property.policies.check_out_time && 
                renderIconItem("Check-out Time", property.policies.check_out_time, <LogOut className="h-4 w-4" />)}
              {property.policies.minimum_stay && 
                renderIconItem("Minimum Stay", `${property.policies.minimum_stay} nights`, <Calendar className="h-4 w-4" />)}
              {"pets_allowed" in property.policies && 
                renderIconItem("Pets Allowed", property.policies.pets_allowed ? "Yes" : "No", <AlertCircle className="h-4 w-4" />)}
              {"smoking_allowed" in property.policies && 
                renderIconItem("Smoking Allowed", property.policies.smoking_allowed ? "Yes" : "No", <Ban className="h-4 w-4" />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Images */}
      {property.images && property.images.length > 0 && (
        <Card className="shadow-sm border-border/40">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl flex items-center gap-2">
              <Tv className="h-5 w-5 text-primary" />
              Property Images
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-md shadow-sm border border-border/50">
                  <img 
                    src={image} 
                    alt={`${property.name} - ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
