
import React from 'react';
import { PropertyAvailabilityChecker } from '@/components/properties/PropertyAvailabilityChecker';
import { EventLegend } from '@/components/properties/calendar/EventLegend';
import { Platform, EventType } from "@/types/enums";

interface PropertyAvailabilitySectionProps {
  propertyId: string;
  getEventColor: (platform?: Platform, eventType?: EventType) => string;
}

export const PropertyAvailabilitySection: React.FC<PropertyAvailabilitySectionProps> = ({ 
  propertyId, 
  getEventColor 
}) => {
  return (
    <div className="lg:col-span-1 space-y-6">
      {propertyId && <PropertyAvailabilityChecker propertyId={propertyId} />}
      <EventLegend getEventColor={getEventColor} />
    </div>
  );
};
