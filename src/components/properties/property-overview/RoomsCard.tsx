
import React from "react";
import { Bed, Bath } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { renderIconItem } from "./helpers";

interface RoomsCardProps {
  property: Property;
}

export function RoomsCard({ property }: RoomsCardProps) {
  return (
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
  );
}
