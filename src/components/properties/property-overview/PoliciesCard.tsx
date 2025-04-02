
import React from "react";
import { Calendar, LogIn, LogOut, AlertCircle, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from "@/types/api-responses";
import { renderIconItem } from "./helpers";

interface PoliciesCardProps {
  property: Property;
}

export function PoliciesCard({ property }: PoliciesCardProps) {
  // Only render if policies exist
  if (!property.policies || Object.keys(property.policies).length === 0) {
    return null;
  }
  
  return (
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
  );
}
