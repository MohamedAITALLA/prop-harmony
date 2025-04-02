
import React from "react";
import { BuildingIcon, DollarSign, Home, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { renderIconItem } from "./helpers";

interface PropertyInfoCardProps {
  property: Property;
}

export function PropertyInfoCard({ property }: PropertyInfoCardProps) {
  return (
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
          {property.price_per_night !== undefined && renderIconItem("Price", `$${property.price_per_night}/night`, <DollarSign className="h-4 w-4" />)}
        </div>
      </CardContent>
    </Card>
  );
}
