
import React from "react";
import { PropertyForm } from "@/components/properties/PropertyForm";

export default function NewProperty() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Property</h1>
        <p className="text-muted-foreground">
          Add a new property to your portfolio
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}
