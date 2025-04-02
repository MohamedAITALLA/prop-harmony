
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { PropertyOverview } from "@/components/properties/PropertyOverview";
import { PropertyICalFeed } from "@/components/properties/PropertyICalFeed";
import { ICalConnectionsManager } from "@/components/properties/ICalConnectionsManager";
import { PropertyConflictsList } from "@/components/conflicts/PropertyConflictsList";
import { PropertyCalendar } from "@/components/properties/PropertyCalendar";
import { PropertySync } from "@/components/properties/PropertySync";
import { Property, CalendarEvent } from "@/types/api-responses";
import { Platform } from "@/types/enums";

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
        <PropertyOverview property={property} />
      </TabsContent>
      
      <TabsContent value="calendar" className="space-y-4">
        <PropertyCalendar
          events={formattedEvents}
          eventsLoading={eventsLoading}
          propertyId={propertyId}
          onExport={onExport}
          hasConflicts={hasConflicts}
          onViewConflicts={onViewConflicts}
          refetchEvents={refetchEvents}
          propertyName={property.name}
        />
      </TabsContent>
      
      <TabsContent value="ical" className="space-y-4">
        <PropertyICalFeed propertyId={propertyId} platform={Platform.MANUAL} />
        {propertyId && <ICalConnectionsManager propertyId={propertyId} />}
      </TabsContent>
      
      <TabsContent value="sync" className="space-y-4">
        {propertyId && <PropertySync propertyId={propertyId} />}
      </TabsContent>
      
      <TabsContent value="conflicts" className="space-y-4">
        <div className="border rounded-md">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Calendar Conflicts</h2>
            <p className="text-muted-foreground">Review and resolve calendar conflicts for this property</p>
          </div>
          {propertyId && <PropertyConflictsList propertyId={propertyId} />}
        </div>
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-4">
        <div className="p-4 border rounded-md">
          <h2 className="text-xl font-semibold mb-2">Property Settings</h2>
          <p className="text-muted-foreground">Settings functionality will be implemented soon.</p>
        </div>
      </TabsContent>
    </>
  );
}
