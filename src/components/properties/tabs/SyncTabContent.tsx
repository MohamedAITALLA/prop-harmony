
import React from "react";
import { PropertySync } from "@/components/properties/PropertySync";

interface SyncTabContentProps {
  propertyId: string;
}

export function SyncTabContent({ propertyId }: SyncTabContentProps) {
  return <PropertySync propertyId={propertyId} />;
}
