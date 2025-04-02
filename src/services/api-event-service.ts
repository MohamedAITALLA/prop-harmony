
import api from "@/lib/api";
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
  
  deleteEvent: async (
    propertyId: string,
    eventId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    // Removed preserveHistory parameter as it's not in the spec
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/events/${eventId}`
    );
    return response.data;
  },

  getPropertyConflicts: async (
    propertyId: string,
    params?: { 
      status?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<ApiResponse<any>> => {
    const response = await api.get(
      `/properties/${propertyId}/conflicts`,
      { params }
    );
    return response.data;
  },

  // Adding the resolveConflict method since components are using it
  resolveConflict: async (
    propertyId: string,
    conflictId: string,
    resolutionData: {
      resolution: string;
      notes?: string;
    }
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/conflicts/${conflictId}/resolve`,
      resolutionData
    );
    return response.data;
  }
};
