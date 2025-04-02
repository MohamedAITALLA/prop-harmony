
import React, { useState, useRef, useEffect } from 'react';
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent } from "@/types/api-responses";
import { Platform, EventType } from "@/types/enums";
import { getEventColor, createICalFeedUrl } from "@/components/properties/calendar/CalendarUtils";
import { CalendarContainer } from '@/components/properties/calendar/CalendarContainer';
import { PropertyAvailabilitySection } from '@/components/properties/calendar/PropertyAvailabilitySection';
import { EventDialogManager, EventDialogManagerRef } from '@/components/properties/calendar/EventDialogManager';

interface PropertyCalendarProps {
  events: any[];
  eventsLoading: boolean;
  propertyId: string;
  onAddEvent?: () => void;
  onExport?: (format: string) => void;
  onEventClick?: (eventInfo: any) => void;
  onDateClick?: (dateInfo: any) => void;
  hasConflicts?: boolean;
  onViewConflicts?: () => void;
  refetchEvents: () => void;
}

export const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ 
  events, 
  eventsLoading, 
  propertyId,
  onExport,
  hasConflicts,
  onViewConflicts,
  refetchEvents
}) => {
  const calendarRef = useRef<any>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const eventDialogRef = useRef<EventDialogManagerRef>(null);

  useEffect(() => {
    if (propertyId) {
      // Reset or initialize any property-specific state here if needed
    }
  }, [propertyId]);

  const handleCalendarNavigation = (action: 'prev' | 'next' | 'today') => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      if (action === 'prev') calendarApi.prev();
      if (action === 'next') calendarApi.next();
      if (action === 'today') calendarApi.today();
      
      setCurrentDate(calendarApi.getDate());
    }
  };

  const copyICalFeedUrl = () => {
    if (propertyId) {
      const url = createICalFeedUrl(propertyId);
      navigator.clipboard.writeText(url);
      toast.success("iCal feed URL copied to clipboard");
    }
  };

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    const nextDay = new Date(new Date(clickedDate).getTime() + 24 * 60 * 60 * 1000);
    
    // Open add event dialog with pre-filled dates
    const startDate = `${clickedDate}T14:00`;
    const endDate = `${format(nextDay, 'yyyy-MM-dd')}T11:00`;
    
    if (eventDialogRef.current) {
      eventDialogRef.current.openAddEventDialog(startDate, endDate);
    }
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const clickedEvent = events.find((e: any) => e.id === eventId);
    
    if (clickedEvent && eventDialogRef.current) {
      const formattedEvent = {
        _id: clickedEvent.id,
        property_id: clickedEvent.extendedProps.property_id || propertyId,
        platform: clickedEvent.extendedProps.platform,
        summary: clickedEvent.title,
        description: clickedEvent.extendedProps.description || "",
        start_date: clickedEvent.start,
        end_date: clickedEvent.end,
        event_type: clickedEvent.extendedProps.event_type,
        status: clickedEvent.extendedProps.status || "confirmed",
        created_at: clickedEvent.extendedProps.created_at || "",
        updated_at: clickedEvent.extendedProps.updated_at || "",
        ical_uid: clickedEvent.extendedProps.ical_uid || ""
      };
      
      eventDialogRef.current.openViewEventDialog(formattedEvent as CalendarEvent);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <CalendarContainer 
        events={events}
        eventsLoading={eventsLoading}
        propertyId={propertyId}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onDateChange={setCurrentDate}
        hasConflicts={hasConflicts}
        onViewConflicts={onViewConflicts}
        onAddEvent={() => eventDialogRef.current?.openAddEventDialog()}
        onExport={onExport}
        copyICalFeedUrl={copyICalFeedUrl}
        currentDate={currentDate}
        handleCalendarNavigation={handleCalendarNavigation}
      />
      
      <PropertyAvailabilitySection 
        propertyId={propertyId}
        getEventColor={getEventColor}
      />

      <EventDialogManager 
        ref={eventDialogRef}
        propertyId={propertyId}
        refetchEvents={refetchEvents}
      />
    </div>
  );
};
