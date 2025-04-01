
import React from "react";
import { 
  Home, Users, Bed, Shower, LogIn, LogOut, Calendar, Ban, AlertCircle, 
  Wifi, Kitchen, Wind, Flame, Tv, Loader, Trash, Car, Elevator, Droplets
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";

export interface PropertyOverviewProps {
  property: Property;
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  // Helper function to render items with icons
  const renderIconItem = (label: string, value: React.ReactNode, icon: React.ReactNode) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
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
      <div className={`flex items-center gap-2 ${!value ? "opacity-50" : ""}`}>
        <div className={`rounded-full p-1 ${value ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}>
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
    <div className="space-y-6">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderIconItem("Property Type", property.property_type, <Home className="h-4 w-4" />)}
            {renderIconItem("Accommodates", `${property.accommodates} guests`, <Users className="h-4 w-4" />)}
            {renderIconItem("Bedrooms", property.bedrooms, <Bed className="h-4 w-4" />)}
            {renderIconItem("Beds", property.beds || '-', <Bed className="h-4 w-4" />)}
            {renderIconItem("Bathrooms", property.bathrooms, <Shower className="h-4 w-4" />)}
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Address</CardTitle>
        </CardHeader>
        <CardContent>
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
          
          {/* Placeholder for map */}
          {property.address.coordinates && (
            <div className="mt-4 bg-muted h-48 rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">Map will be displayed here</p>
              <p className="text-xs text-muted-foreground">
                ({property.address.coordinates.latitude}, {property.address.coordinates.longitude})
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Amenities */}
      {property.amenities && Object.keys(property.amenities).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {renderAmenity("WiFi", property.amenities.wifi, <Wifi className="h-4 w-4" />)}
              {renderAmenity("Kitchen", property.amenities.kitchen, <Kitchen className="h-4 w-4" />)}
              {renderAmenity("Air Conditioning", property.amenities.ac, <Wind className="h-4 w-4" />)}
              {renderAmenity("Heating", property.amenities.heating, <Flame className="h-4 w-4" />)}
              {renderAmenity("TV", property.amenities.tv, <Tv className="h-4 w-4" />)}
              {renderAmenity("Washer", property.amenities.washer, <Loader className="h-4 w-4" />)}
              {renderAmenity("Dryer", property.amenities.dryer, <Trash className="h-4 w-4" />)}
              {renderAmenity("Parking", property.amenities.parking, <Car className="h-4 w-4" />)}
              {renderAmenity("Elevator", property.amenities.elevator, <Elevator className="h-4 w-4" />)}
              {renderAmenity("Pool", property.amenities.pool, <Droplets className="h-4 w-4" />)}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Policies */}
      {property.policies && Object.keys(property.policies).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-md">
                  <img 
                    src={image} 
                    alt={`${property.name} - ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform" 
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
