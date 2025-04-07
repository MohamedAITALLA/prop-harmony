
import React from "react";
import { PropertySync } from "@/components/properties/PropertySync";

interface SyncTabContentProps {
  propertyId: string;
}

export function SyncTabContent({ propertyId }: SyncTabContentProps) {
  return (
    <div className="space-y-6">
      <PropertySync propertyId={propertyId} />
    </div>
  );
}
