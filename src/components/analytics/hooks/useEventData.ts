
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/api-event-service";
import React from "react";
import { CalendarEvent } from "@/types/api-responses";

export function useEventData(propertyId?: string) {
  const {
    data: eventsData,
    isLoading: isLoadingEvents
  } = useQuery({
    queryKey: ["property-events", propertyId],
    queryFn: async () => {
      if (!propertyId) return { data: [], meta: { total: 0, property_id: propertyId, platforms: {} } };
      const response = await eventService.getEvents(propertyId);
      return response;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const eventsDistributionData = React.useMemo(() => {
    if (!eventsData?.data?.length) return [];
    
    const platforms: Record<string, number> = {};
    eventsData.data.forEach(event => {
      const platform = event.platform || 'unknown';
      platforms[platform] = (platforms[platform] || 0) + 1;
    });
    
    return Object.entries(platforms).map(([platform, count]) => ({
      name: platform,
      value: count,
    }));
  }, [eventsData]);

  const eventStatusCounts = React.useMemo(() => {
    if (!eventsData?.data?.length) return {} as Record<string, number>;
    
    return eventsData.data.reduce((acc: Record<string, number>, event) => {
      const status = event.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [eventsData]);

  const eventTypeCounts = React.useMemo(() => {
    if (!eventsData?.data?.length) return {} as Record<string, number>;
    
    return eventsData.data.reduce((acc: Record<string, number>, event) => {
      const eventType = event.event_type || "unknown";
      acc[eventType] = (acc[eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [eventsData]);

  return {
    eventsData,
    isLoadingEvents,
    eventsDistributionData,
    eventStatusCounts,
    eventTypeCounts
  };
}
