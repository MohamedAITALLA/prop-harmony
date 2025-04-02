
import api from "@/lib/base-api";

export const calendarService = {
  getCalendar: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/calendar`);
  },
  getICalFeed: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/ical-feed`);
  },
  checkAvailability: async (propertyId: string, startDate: string, endDate: string) => {
    try {
      console.log(`Checking availability for property ${propertyId} from ${startDate} to ${endDate}`);
      const response = await api.get(`/properties/${propertyId}/calendar/availability`, {
        params: { start_date: startDate, end_date: endDate }
      });
      
      // Log the response for debugging
      console.log("Availability check response:", response.data);
      
      // If the API returns data in a different format, transform it to match our expected format
      if (response.data && !response.data.data?.is_available && response.data.data?.available !== undefined) {
        // Transform legacy format to new format
        return {
          ...response.data,
          data: {
            property_id: propertyId,
            start_date: startDate,
            end_date: endDate,
            is_available: response.data.data.available,
            conflicting_events: response.data.data.conflicts || [],
            duration_days: response.data.data.duration_days || 
              (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1
          }
        };
      }
      
      return response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;
    }
  }
};

export default calendarService;
