
import React from "react";
import { Home, Edit } from "lucide-react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function FormHeader() {
  return (
    <CardHeader className="bg-primary/5 border-b">
      <CardTitle className="flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <span>Edit Property</span>
      </CardTitle>
      <CardDescription>
        Update your property details, amenities, and policies
      </CardDescription>
    </CardHeader>
  );
}
