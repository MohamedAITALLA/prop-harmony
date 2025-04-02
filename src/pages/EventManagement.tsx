
import React from "react";
import { usePropertiesData } from "@/hooks/properties/usePropertiesData";
import { useEvents } from "@/hooks/events/useEvents";
import { 
  EventManagementProvider, 
  useEventManagement 
} from "@/components/events/EventManagementContext";
import { EventsHeader } from "@/components/events/EventsHeader";
import { EventFilters } from "@/components/events/EventFilters";
import { EventsTable } from "@/components/events/EventsTable";
import { AddEventDialog } from "@/components/events/AddEventDialog";

const EventManagementContent: React.FC = () => {
  const { 
    selectedProperties, 
    selectedPlatforms, 
    selectedEventTypes, 
    dateRange,
    searchQuery,
    isAddEventOpen,
    setIsAddEventOpen,
    properties
  } = useEventManagement();

  const { events, filteredEvents, isLoading } = useEvents({
    selectedProperties,
    selectedPlatforms,
    selectedEventTypes,
    dateRange,
    searchQuery
  });

  return (
    <div className="space-y-6">
      <EventsHeader />
      
      <div className="flex flex-col gap-4">
        <EventFilters />
        
        <EventsTable 
          events={events}
          filteredEvents={filteredEvents}
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
      
      <AddEventDialog 
        isOpen={isAddEventOpen}
        onOpenChange={setIsAddEventOpen}
        properties={properties}
      />
    </div>
  );
};

export default function EventManagement() {
  const { properties } = usePropertiesData();

  return (
    <EventManagementProvider properties={properties}>
      <EventManagementContent />
    </EventManagementProvider>
  );
}
