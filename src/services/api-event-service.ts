
import api from "@/lib/api";
import { CalendarEvent, EventResponse } from "@/types/api-responses";

export const eventService = {
  /**
   * Get events for a property with optional filters
   * @returns {Promise<{
   *   success: boolean,
   *   data: CalendarEvent[],
   *   meta: {
   *     total: number,
   *     property_id: string,
   *     platforms: object,
   *     date_range: { from: string, to: string }
   *   },
   *   message: string,
   *   timestamp: string
   * }>}
   */
  getEvents: async (propertyId: string, params: any = {}) => {
    const response = await api.get(`/properties/${propertyId}/events`, { params });
    return response.data;
  },

  /**
   * Create a new event for a property
   * Returns the created event and conflict information if any
   * @returns {Promise<EventResponse>} Object containing event data and conflict metadata
   */
  createEvent: async (propertyId: string, eventData: Partial<CalendarEvent>) => {
    const response = await api.post(`/properties/${propertyId}/events`, eventData);
    return response.data as EventResponse;
  },

  /**
   * Delete an event from a property
   * @returns {Promise<{
   *   success: boolean,
   *   data: CalendarEvent,
   *   meta: {
   *     property_id: string,
   *     event_id: string,
   *     preserve_history: boolean,
   *     action: string
   *   },
   *   message: string,
   *   timestamp: string
   * }>}
   */
  deleteEvent: async (propertyId: string, eventId: string) => {
    const response = await api.delete(`/properties/${propertyId}/events/${eventId}`);
    return response.data;
  },

  /**
   * Check for event conflicts in the specified date range
   * @returns {Promise<{
   *   success: boolean, 
   *   data: { conflicts: CalendarEvent[] }, 
   *   message: string
   * }>}
   */
  checkConflicts: async (propertyId: string, eventId: string = "", startDate: string, endDate: string) => {
    const response = await api.get(`/properties/${propertyId}/events/conflicts`, {
      params: { event_id: eventId, start_date: startDate, end_date: endDate }
    });
    return response.data;
  },

  /**
   * Resolve a booking conflict
   * @param {string} propertyId - The property ID
   * @param {string} conflictId - The conflict ID to resolve
   * @param {string} action - The resolution action ('keep_all', 'keep_one', 'delete_all')
   * @param {string} [selectedEventId] - The event ID to keep (if action is 'keep_one')
   * @returns {Promise<{success: boolean, message: string}>}
   */
  resolveConflict: async (propertyId: string, conflictId: string, action: string, selectedEventId?: string) => {
    const response = await api.post(`/properties/${propertyId}/conflicts/${conflictId}/resolve`, { 
      action, 
      selected_event_id: selectedEventId 
    });
    return response.data;
  }
};
