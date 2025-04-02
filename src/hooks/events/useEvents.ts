
import { useQuery } from "@tanstack/react-query";
import { convertToMongoIdFormat } from "@/lib/id-conversion";
import { useState, useMemo } from "react";
import { CalendarEvent } from "@/types/api-responses";
import { DateRange } from "react-day-picker";

interface UseEventsOptions {
  selectedProperties: string[];
  selectedPlatforms: string[];
  selectedEventTypes: string[];
  dateRange?: DateRange;
  searchQuery: string;
}

export function useEvents(options: UseEventsOptions) {
  const { selectedProperties, selectedPlatforms, selectedEventTypes, dateRange, searchQuery } = options;
  const [mockEvents, setMockEvents] = useState<CalendarEvent[]>([]);

  const { data: eventsData = [], isLoading } = useQuery({
    queryKey: ["events", selectedProperties, selectedPlatforms, selectedEventTypes, dateRange],
    queryFn: async () => {
      try {
        // In the future, this would call a real API
        const mockData = getMockEvents();
        setMockEvents(convertToMongoIdFormat(mockData) as CalendarEvent[]);
        return { events: convertToMongoIdFormat(mockData) };
      } catch (error) {
        console.error("Error fetching events:", error);
        return { events: [] };
      }
    },
  });

  const events = useMemo(() => {
    const data = Array.isArray(eventsData) ? eventsData : eventsData.events || [];
    return data as CalendarEvent[];
  }, [eventsData]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => 
      (searchQuery === "" || 
        event.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.property?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.platform && event.platform.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [events, searchQuery]);

  return {
    events,
    filteredEvents,
    isLoading
  };
}

function getMockEvents() {
  return [
    {
      _id: "1",
      property: { _id: "1", name: "Oceanfront Villa" },
      platform: "Airbnb",
      summary: "Summer Vacation Booking",
      start_date: "2025-06-15T14:00:00Z",
      end_date: "2025-06-22T11:00:00Z",
      event_type: "booking",
      status: "confirmed",
      description: "Guest from NYC, 4 people"
    },
    {
      _id: "2",
      property: { _id: "2", name: "Downtown Loft" },
      platform: "Booking",
      summary: "Business Trip Stay",
      start_date: "2025-05-03T15:00:00Z",
      end_date: "2025-05-07T12:00:00Z",
      event_type: "booking",
      status: "confirmed",
      description: "Business traveler from Chicago"
    },
    {
      _id: "3",
      property: { _id: "3", name: "Mountain Cabin" },
      platform: "manual",
      summary: "Bathroom Renovation",
      start_date: "2025-04-10T08:00:00Z",
      end_date: "2025-04-15T18:00:00Z",
      event_type: "maintenance",
      status: "confirmed",
      description: "Replacing shower and fixtures"
    },
    {
      _id: "4",
      property: { _id: "1", name: "Oceanfront Villa" },
      platform: "Vrbo",
      summary: "Family Reunion",
      start_date: "2025-07-01T15:00:00Z",
      end_date: "2025-07-08T11:00:00Z",
      event_type: "booking",
      status: "tentative",
      description: "Large family, 8 people"
    },
    {
      _id: "5",
      property: { _id: "4", name: "Beachside Condo" },
      platform: "TripAdvisor",
      summary: "Weekend Getaway",
      start_date: "2025-05-12T16:00:00Z",
      end_date: "2025-05-14T10:00:00Z",
      event_type: "booking",
      status: "cancelled",
      description: "Cancelled due to guest emergency"
    },
    {
      _id: "6",
      property: { _id: "5", name: "Suburban House" },
      platform: "manual",
      summary: "Owner Block",
      start_date: "2025-04-25T00:00:00Z",
      end_date: "2025-04-30T23:59:59Z",
      event_type: "blocked",
      status: "confirmed",
      description: "Owner using property"
    },
  ];
}
