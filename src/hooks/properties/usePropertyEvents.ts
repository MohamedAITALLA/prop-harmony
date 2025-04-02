
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/api-service";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Platform, EventType } from "@/types/enums";

interface FilterOptions {
  platforms?: Platform[];
  eventTypes?: EventType[];
  dateRange?: DateRange;
}

export function usePropertyEvents(id: string | undefined, filters?: FilterOptions) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(filters || {});
  
  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    refetch: refetchEvents,
    error: eventsError,
    isError: isEventsError
  } = useQuery({
    queryKey: ["property-events", id, filterOptions],
    queryFn: async () => {
      if (!id) return [];
      try {
        // Prepare filter parameters
        const params: any = {};
        
        if (filterOptions.platforms && filterOptions.platforms.length > 0) {
          params.platforms = filterOptions.platforms;
        }
        
        if (filterOptions.eventTypes && filterOptions.eventTypes.length > 0) {
          params.event_types = filterOptions.eventTypes;
        }
        
        if (filterOptions.dateRange) {
          if (filterOptions.dateRange.from) {
            params.start_date = format(filterOptions.dateRange.from, 'yyyy-MM-dd');
          }
          if (filterOptions.dateRange.to) {
            params.end_date = format(filterOptions.dateRange.to, 'yyyy-MM-dd');
          }
        }
        
        const response = await eventService.getEvents(id, params);
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

  const updateFilters = (newFilters: FilterOptions) => {
    setFilterOptions(prev => ({ ...prev, ...newFilters }));
  };

  return {
    eventsData,
    formattedEvents,
    eventsLoading,
    refetchEvents,
    eventsError,
    isEventsError,
    updateFilters,
    filterOptions
  };
}
