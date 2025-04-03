
import React from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";

interface LocationCardProps {
  property: Property;
}

export function LocationCard({ property }: LocationCardProps) {
  return (
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
        {property.address.state_province && <p className="text-muted-foreground text-sm">{property.address.state_province}</p>}
        {property.address.postal_code && <p className="text-muted-foreground text-sm">Postal Code: {property.address.postal_code}</p>}
      </CardContent>
    </Card>
  );
}
