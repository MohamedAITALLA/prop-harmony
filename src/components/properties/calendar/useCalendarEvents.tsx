
import { useMemo } from 'react';
import { Platform, EventType } from '@/types/enums';
import { DateRange } from 'react-day-picker';

interface UseCalendarEventsProps {
  events: any[];
  searchQuery: string;
  selectedPlatforms: Platform[];
  selectedEventTypes: EventType[];
  dateRange: DateRange | undefined;
}

export const useCalendarEvents = ({
  events,
  searchQuery,
  selectedPlatforms,
  selectedEventTypes,
  dateRange
}: UseCalendarEventsProps) => {
  
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by search query
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by platforms
      if (selectedPlatforms.length > 0 && 
          !selectedPlatforms.includes(event.extendedProps?.platform as Platform)) {
        return false;
      }
      
      // Filter by event types
      if (selectedEventTypes.length > 0 && 
          !selectedEventTypes.includes(event.extendedProps?.event_type as EventType)) {
        return false;
      }
      
      // Filter by date range
      if (dateRange?.from) {
        const eventStart = new Date(event.start);
        if (eventStart < dateRange.from) {
          return false;
        }
      }
      
      if (dateRange?.to) {
        const eventEnd = new Date(event.end);
        if (eventEnd > dateRange.to) {
          return false;
        }
      }
      
      // If all filters pass, include the event
      return true;
    });
  }, [events, searchQuery, selectedPlatforms, selectedEventTypes, dateRange]);
  
  const formattedEvents = useMemo(() => {
    return filteredEvents.map(event => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: true,
      resourceId: event.extendedProps?.property_id,
      extendedProps: {
        platform: event.extendedProps?.platform,
        event_type: event.extendedProps?.event_type,
        status: event.extendedProps?.status,
        description: event.extendedProps?.description
      }
    }));
  }, [filteredEvents]);

  return {
    filteredEvents,
    formattedEvents
  };
};
