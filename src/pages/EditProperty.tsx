
import React from "react";
import { useParams } from "react-router-dom";
import { PropertyEditForm } from "@/components/properties/PropertyEditForm";
import { usePropertyDetails } from "@/hooks/properties/usePropertyDetails";
import { PropertyDetailsLoading } from "@/components/properties/PropertyDetailsLoading";
import { PropertyDetailsError } from "@/components/properties/PropertyDetailsError";
import { toast } from "sonner";

export default function EditProperty() {
  const { id } = useParams<{ id: string }>();
  const { property, propertyLoading, propertyError, refetchProperty, manualRetry } = usePropertyDetails(id);

  const handleRetryLoadProperty = () => {
    manualRetry();
    toast.info("Retrying to load property details...");
  };

  if (propertyLoading) {
    return <PropertyDetailsLoading />;
  }

  if (propertyError || !property) {
    return (
      <PropertyDetailsError
        onRetry={handleRetryLoadProperty}
        onBack={() => window.history.back()}
        error={propertyError instanceof Error ? propertyError : null}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
        <p className="text-muted-foreground">
          Update your property details
        </p>
      </div>

      <PropertyEditForm propertyId={id} initialData={property} />
    </div>
  );
}
