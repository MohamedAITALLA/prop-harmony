
import React from "react";
import { Property } from "@/types/api-responses";
import { PropertyInfoCard } from "./property-overview/PropertyInfoCard";
import { RoomsCard } from "./property-overview/RoomsCard";
import { LocationCard } from "./property-overview/LocationCard";
import { AddressDetailsCard } from "./property-overview/AddressDetailsCard";
import { AmenitiesCard } from "./property-overview/AmenitiesCard";
import { PoliciesCard } from "./property-overview/PoliciesCard";
import { ImagesCard } from "./property-overview/ImagesCard";

export interface PropertyOverviewProps {
  property: Property;
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Quick Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PropertyInfoCard property={property} />
        <RoomsCard property={property} />
        <LocationCard property={property} />
      </div>

      {/* Address */}
      <AddressDetailsCard property={property} />

      {/* Amenities */}
      <AmenitiesCard property={property} />

      {/* Policies */}
      <PoliciesCard property={property} />

      {/* Property Images */}
      <ImagesCard property={property} />
    </div>
  );
}
