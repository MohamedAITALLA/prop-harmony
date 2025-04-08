
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Property } from "@/types/api-responses";
import { OverviewTabContent } from "./tabs/OverviewTabContent";
import { CalendarTabContent } from "./tabs/CalendarTabContent";
import { ConflictsTabContent } from "./tabs/ConflictsTabContent";
import { ICalTabContent } from "./tabs/ICalTabContent";
import { SyncTabContent } from "./tabs/SyncTabContent";
import { SettingsTabContent } from "./tabs/SettingsTabContent";

interface PropertyDetailsContentProps {
  property: Property;
  activeTab: string;
  propertyId: string;
  formattedEvents: any[];
  eventsLoading: boolean;
  hasConflicts: boolean;
  onExport: (format: string) => void;
  onViewConflicts: () => void;
  refetchEvents: () => void;
}

export function PropertyDetailsContent({
  property,
  activeTab,
  propertyId,
  formattedEvents,
  eventsLoading,
  hasConflicts,
  onExport,
  onViewConflicts,
  refetchEvents
}: PropertyDetailsContentProps) {
  return (
    <>
      <TabsContent value="overview" className="space-y-4">
        <OverviewTabContent property={property} />
      </TabsContent>
      
      <TabsContent value="calendar" className="space-y-4">
        <CalendarTabContent 
          propertyId={propertyId}
          formattedEvents={formattedEvents}
          eventsLoading={eventsLoading}
          propertyName={property.name}
          hasConflicts={hasConflicts}
          onExport={onExport}
          onViewConflicts={onViewConflicts}
          refetchEvents={refetchEvents}
        />
      </TabsContent>
      
      <TabsContent value="conflicts" className="space-y-4">
        <ConflictsTabContent propertyId={propertyId} />
      </TabsContent>
      
      <TabsContent value="ical" className="space-y-4">
        <ICalTabContent propertyId={propertyId} />
      </TabsContent>
      
      <TabsContent value="sync" className="space-y-4">
        <SyncTabContent propertyId={propertyId} />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <SettingsTabContent />
      </TabsContent>
    </>
  );
}
