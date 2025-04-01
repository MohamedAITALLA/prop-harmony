
import React from "react";
import { Property } from "@/types/api-responses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Bed, Bath, Calendar, LogIn, LogOut, Paw, Smoking } from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";
import { PropertyType } from "@/types/enums";

interface PropertyItemProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

interface PropertyOverviewProps {
  property: Property;
}

const PropertyItem = ({ icon, label, value }: PropertyItemProps) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="rounded-md p-2 bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
};

export function PropertyOverview({ property }: PropertyOverviewProps) {
  const formatPropertyType = (type: PropertyType) => {
    return capitalizeFirstLetter(type);
  };
  
  return (
    <div className="space-y-6">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyItem
              icon={<Home className="h-5 w-5" />}
              label="Property Type"
              value={formatPropertyType(property.property_type)}
            />
            <PropertyItem
              icon={<Users className="h-5 w-5" />}
              label="Accommodates"
              value={`${property.accommodates} guests`}
            />
            <PropertyItem
              icon={<Bed className="h-5 w-5" />}
              label="Bedrooms"
              value={property.bedrooms}
            />
            <PropertyItem
              icon={<Bed className="h-5 w-5" />}
              label="Beds"
              value={property.beds || '-'}
            />
            <PropertyItem
              icon={<Bath className="h-5 w-5" />}
              label="Bathrooms"
              value={property.bathrooms}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {property.address.street && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Street</p>
                  <p>{property.address.street}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p>{property.address.city}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">State/Province</p>
                <p>{property.address.stateProvince}</p>
              </div>
              
              {property.address.postalCode && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                  <p>{property.address.postalCode}</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Country</p>
              <p>{property.address.country}</p>
            </div>
            
            {property.address.coordinates && (
              <div className="mt-4 aspect-video w-full h-[300px] rounded-md overflow-hidden bg-muted">
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Map View (coordinates: {property.address.coordinates.latitude}, {property.address.coordinates.longitude})
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Amenities */}
      {property.amenities && (
        <Card>
          <CardHeader>
            <CardTitle>Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(property.amenities).map(([key, value]) => (
                value && (
                  <Badge key={key} variant="outline" className="justify-start px-3 py-1">
                    {capitalizeFirstLetter(key)}
                  </Badge>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Policies */}
      {property.policies && (
        <Card>
          <CardHeader>
            <CardTitle>Policies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {property.policies.check_in_time && (
                <PropertyItem
                  icon={<LogIn className="h-5 w-5" />}
                  label="Check-in Time"
                  value={property.policies.check_in_time}
                />
              )}
              
              {property.policies.check_out_time && (
                <PropertyItem
                  icon={<LogOut className="h-5 w-5" />}
                  label="Check-out Time"
                  value={property.policies.check_out_time}
                />
              )}
              
              {property.policies.minimum_stay !== undefined && (
                <PropertyItem
                  icon={<Calendar className="h-5 w-5" />}
                  label="Minimum Stay"
                  value={`${property.policies.minimum_stay} nights`}
                />
              )}
              
              {property.policies.pets_allowed !== undefined && (
                <PropertyItem
                  icon={<Paw className="h-5 w-5" />}
                  label="Pets Allowed"
                  value={property.policies.pets_allowed ? 'Yes' : 'No'}
                />
              )}
              
              {property.policies.smoking_allowed !== undefined && (
                <PropertyItem
                  icon={<Smoking className="h-5 w-5" />}
                  label="Smoking Allowed"
                  value={property.policies.smoking_allowed ? 'Yes' : 'No'}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Images */}
      {property.images && property.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.images.map((image, index) => (
                <div 
                  key={index}
                  className="aspect-video overflow-hidden rounded-md"
                >
                  <img 
                    src={image} 
                    alt={`Property ${index + 1}`} 
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
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
