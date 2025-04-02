
import React from "react";
import { PropertyOverview } from "@/components/properties/PropertyOverview";
import { Property } from "@/types/api-responses";

interface OverviewTabContentProps {
  property: Property;
}

export function OverviewTabContent({ property }: OverviewTabContentProps) {
  return <PropertyOverview property={property} />;
}
