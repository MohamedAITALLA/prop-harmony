
import api from "@/lib/base-api";
import { EventsResponse, ApiResponse, CalendarEvent } from "@/types/api-responses";

export const eventService = {
  getEvents: async (
    propertyId: string,
    params?: {
      start_date?: string;
      end_date?: string;
      platforms?: string[];
      event_types?: string[];
    }
  ): Promise<EventsResponse> => {
    const response = await api.get<EventsResponse>(
      `/properties/${propertyId}/events`,
      { params }
    );
    return response.data;
  },
  
  createEvent: async (
    propertyId: string,
    eventData: {
      platform?: string;
      summary: string;
      start_date: string;
      end_date: string;
      event_type: string;
      status?: string;
      description?: string;
    }
  ): Promise<ApiResponse<CalendarEvent>> => {
    const response = await api.post<ApiResponse<CalendarEvent>>(
      `/properties/${propertyId}/events`,
      eventData
    );
    return response.data;
  },
  
  updateEvent: async (
    propertyId: string,
    eventId: string,
    eventData: {
      platform?: string;
      summary?: string;
      start_date?: string;
      end_date?: string;
      event_type?: string;
      status?: string;
      description?: string;
    }
  ): Promise<ApiResponse<CalendarEvent>> => {
    const response = await api.put<ApiResponse<CalendarEvent>>(
      `/properties/${propertyId}/events/${eventId}`,
      eventData
    );
    return response.data;
  },
  
  deleteEvent: async (
    propertyId: string,
    eventId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    // Always use preserve_history=true without showing to user
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/events/${eventId}`,
      { params: { preserve_history: true } }
    );
    return response.data;
  }
};

export default eventService;
