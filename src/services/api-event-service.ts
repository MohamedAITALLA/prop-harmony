
import api from "@/lib/api";
import { EventsResponse, ApiResponse, CalendarEvent, Conflict } from "@/types/api-responses";

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
  
  deleteEvent: async (
    propertyId: string,
    eventId: string,
    preserveHistory?: boolean
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/events/${eventId}`,
      { params }
    );
    return response.data;
  },

  // Add missing methods for conflicts
  getPropertyConflicts: async (
    propertyId: string,
    params?: { status?: string }
  ): Promise<ApiResponse<Conflict[]>> => {
    const response = await api.get<ApiResponse<Conflict[]>>(
      `/properties/${propertyId}/conflicts`,
      { params }
    );
    return response.data;
  },

  resolveConflict: async (
    propertyId: string,
    conflictId: string,
    resolution: { resolution: string; event_id?: string }
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/conflicts/${conflictId}/resolve`,
      resolution
    );
    return response.data;
  }
};
