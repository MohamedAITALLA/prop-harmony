
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/api-event-service";
import { useMemo } from "react";

export function usePropertyEvents(id: string | undefined) {
  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    refetch: refetchEvents,
    error: eventsError,
    isError: isEventsError
  } = useQuery({
    queryKey: ["property-events", id],
    queryFn: async () => {
      if (!id) return [];
      try {
        const response = await eventService.getEvents(id);
        return response.data || [];
      } catch (error) {
        console.error("Error fetching property events:", error);
        return [];
      }
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const formattedEvents = useMemo(() => {
    if (!eventsData) return [];
    
    return eventsData.map((event) => ({
      id: event._id,
      title: event.summary,
      start: event.start_date,
      end: event.end_date,
      extendedProps: {
        platform: event.platform,
        event_type: event.event_type,
        status: event.status,
        description: event.description,
        property_id: id,
        created_at: event.created_at,
        updated_at: event.updated_at,
        ical_uid: event.ical_uid
      }
    }));
  }, [eventsData, id]);

  return {
    eventsData,
    formattedEvents,
    eventsLoading,
    refetchEvents,
    eventsError,
    isEventsError
  };
}
