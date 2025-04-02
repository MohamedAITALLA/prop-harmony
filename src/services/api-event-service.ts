
import api from "@/lib/api";
import { CalendarEvent, EventResponse } from "@/types/api-responses";

export const eventService = {
  /**
   * Get events for a property with optional filters
   */
  getEvents: async (propertyId: string, params: any = {}) => {
    const response = await api.get(`/properties/${propertyId}/events`, { params });
    return response.data;
  },

  /**
   * Create a new event for a property
   * Returns the created event and conflict information if any
   */
  createEvent: async (propertyId: string, eventData: Partial<CalendarEvent>) => {
    const response = await api.post(`/properties/${propertyId}/events`, eventData);
    return response.data as EventResponse;
  },

  /**
   * Delete an event from a property
   */
  deleteEvent: async (propertyId: string, eventId: string) => {
    const response = await api.delete(`/properties/${propertyId}/events/${eventId}`);
    return response.data;
  },

  /**
   * Check for event conflicts in the specified date range
   */
  checkConflicts: async (propertyId: string, eventId: string = "", startDate: string, endDate: string) => {
    const response = await api.get(`/properties/${propertyId}/events/conflicts`, {
      params: { event_id: eventId, start_date: startDate, end_date: endDate }
    });
    return response.data;
  }
};
