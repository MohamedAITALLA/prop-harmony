
import api from "@/lib/api";
import { ApiResponse, CalendarEvent, Conflict } from "@/types/api-responses";

export interface EventFilters {
  start_date?: string;
  end_date?: string;
  platforms?: string[];
  event_types?: string[];
}

export const eventService = {
  getEvents: async (propertyId: string, filters?: EventFilters): Promise<ApiResponse<CalendarEvent[]>> => {
    try {
      const response = await api.get(`/properties/${propertyId}/events`, {
        params: filters
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching events:", error);
      return { success: false, data: [], message: "Failed to fetch events" };
    }
  },

  createEvent: async (
    propertyId: string,
    eventData: {
      summary: string;
      start_date: string;
      end_date: string;
      event_type: string;
      description?: string;
      platform?: string;
      status?: string;
    }
  ): Promise<ApiResponse<CalendarEvent>> => {
    try {
      const response = await api.post(`/properties/${propertyId}/events`, eventData);
      return response.data;
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  },

  updateEvent: async (
    propertyId: string,
    eventId: string,
    eventData: Partial<{
      summary: string;
      start_date: string;
      end_date: string;
      event_type: string;
      description: string;
      status: string;
    }>
  ): Promise<ApiResponse<CalendarEvent>> => {
    try {
      const response = await api.put(
        `/properties/${propertyId}/events/${eventId}`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  },

  deleteEvent: async (
    propertyId: string,
    eventId: string
  ): Promise<ApiResponse<{ success: boolean }>> => {
    try {
      const response = await api.delete(`/properties/${propertyId}/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting event:", error);
      throw error;
    }
  },

  getPropertyConflicts: async (
    propertyId: string,
    params?: { status?: string }
  ): Promise<ApiResponse<Conflict[]>> => {
    try {
      const response = await api.get(`/properties/${propertyId}/conflicts`, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching conflicts:", error);
      return { success: false, data: [], message: "Failed to fetch conflicts" };
    }
  },

  resolveConflict: async (
    propertyId: string, 
    conflictId: string,
    resolution: string
  ): Promise<ApiResponse<{}>> => {
    try {
      const response = await api.put(`/properties/${propertyId}/conflicts/${conflictId}/resolve`, {
        resolution
      });
      return response.data;
    } catch (error) {
      console.error("Error resolving conflict:", error);
      throw error;
    }
  }
};
