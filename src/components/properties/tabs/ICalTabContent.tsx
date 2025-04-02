
import React from "react";
import { PropertyICalFeed } from "@/components/properties/PropertyICalFeed";
import { ICalConnectionsManager } from "@/components/properties/ICalConnectionsManager";
import { Platform } from "@/types/enums";

interface ICalTabContentProps {
  propertyId: string;
}

export function ICalTabContent({ propertyId }: ICalTabContentProps) {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">iCalendar Integration</h2>
        <p className="text-muted-foreground mb-6">
          Manage your property's iCalendar feeds and external calendar connections.
          Import and export reservations between different booking platforms.
        </p>
      </div>
      <PropertyICalFeed propertyId={propertyId} platform={Platform.MANUAL} />
      {propertyId && <ICalConnectionsManager propertyId={propertyId} />}
    </div>
  );
}
