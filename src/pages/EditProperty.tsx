
import React from "react";
import { useParams } from "react-router-dom";
import { PropertyEditForm } from "@/components/properties/PropertyEditForm";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-muted-foreground">
          Update your property information
        </p>
      </div>

      <PropertyEditForm propertyId={id || ""} />
    </div>
  );
}
