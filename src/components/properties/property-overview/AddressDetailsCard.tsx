
import React from "react";
import { MapPin, MapPinned } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";

interface AddressDetailsCardProps {
  property: Property;
}

export function AddressDetailsCard({ property }: AddressDetailsCardProps) {
  return (
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
  );
}
