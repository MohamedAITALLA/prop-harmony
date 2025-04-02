
import { useQuery } from "@tanstack/react-query";
import { eventService } from "@/services/api-event-service";
import React from "react";
import { CalendarEvent } from "@/types/api-responses";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

export interface EventAnalyticsData {
  eventsData: {
    data: CalendarEvent[];
    meta: {
      total: number;
      property_id: string | null;
      platforms: Record<string, number>;
    }
  } | undefined;
  isLoadingEvents: boolean;
  eventsDistributionData: Array<{name: string; value: number}>;
  eventStatusCounts: Record<string, number>;
  eventTypeCounts: Record<string, number>;
  eventsByMonth: Array<{name: string; count: number}>;
}

export function useEventData(propertyId?: string): EventAnalyticsData {
  const currentDate = new Date();
  const firstDayPrevMonth = startOfMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1));
  const lastDayCurrentMonth = endOfMonth(currentDate);

  const {
    data: eventsData,
    isLoading: isLoadingEvents
  } = useQuery({
    queryKey: ["property-events", propertyId],
    queryFn: async () => {
      if (!propertyId) return { 
        data: [], 
        meta: { 
          total: 0, 
          property_id: null, 
          platforms: {} 
        } 
      };
      
      const response = await eventService.getEvents(propertyId, {
        start_date: format(firstDayPrevMonth, 'yyyy-MM-dd'),
        end_date: format(lastDayCurrentMonth, 'yyyy-MM-dd')
      });
      
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
      name: platform.charAt(0).toUpperCase() + platform.slice(1),
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
  
  const eventsByMonth = React.useMemo(() => {
    if (!eventsData?.data?.length) return [];
    
    // Group events by month
    const monthCounts: Record<string, number> = {};
    
    // Iterate through the last 6 months to ensure we have entries for all months
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = format(monthDate, 'yyyy-MM');
      monthCounts[monthKey] = 0;
    }
    
    // Count events by month
    eventsData.data.forEach(event => {
      const startDate = parseISO(event.start_date);
      const monthKey = format(startDate, 'yyyy-MM');
      
      if (monthCounts[monthKey] !== undefined) {
        monthCounts[monthKey] += 1;
      }
    });
    
    // Format for chart display, sort by date ascending
    return Object.entries(monthCounts)
      .map(([key, count]) => ({
        name: format(parseISO(`${key}-01`), 'MMM yyyy'),
        count
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [eventsData, currentDate]);

  return {
    eventsData,
    isLoadingEvents,
    eventsDistributionData,
    eventStatusCounts,
    eventTypeCounts,
    eventsByMonth
  };
}
