
import React from "react";
import { PropertyCalendar } from "@/components/properties/PropertyCalendar";

interface CalendarTabContentProps {
  propertyId: string;
  formattedEvents: any[];
  eventsLoading: boolean;
  propertyName: string;
  hasConflicts: boolean;
  onExport: (format: string) => void;
  onViewConflicts: () => void;
  refetchEvents: () => void;
}

export function CalendarTabContent({
  propertyId,
  formattedEvents,
  eventsLoading,
  propertyName,
  hasConflicts,
  onExport,
  onViewConflicts,
  refetchEvents
}: CalendarTabContentProps) {
  return (
    <PropertyCalendar
      events={formattedEvents}
      eventsLoading={eventsLoading}
      propertyId={propertyId}
      onExport={onExport}
      hasConflicts={hasConflicts}
      onViewConflicts={onViewConflicts}
      refetchEvents={refetchEvents}
      propertyName={propertyName}
    />
  );
}
