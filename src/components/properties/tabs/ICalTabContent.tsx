
import React from "react";
import { PropertyICalFeed } from "@/components/properties/PropertyICalFeed";
import { ICalConnectionsManager } from "@/components/properties/ICalConnectionsManager";
import { Platform } from "@/types/enums";

interface ICalTabContentProps {
  propertyId: string;
}

export function ICalTabContent({ propertyId }: ICalTabContentProps) {
  return (
    <>
      <PropertyICalFeed propertyId={propertyId} platform={Platform.MANUAL} />
      {propertyId && <ICalConnectionsManager propertyId={propertyId} />}
    </>
  );
}
