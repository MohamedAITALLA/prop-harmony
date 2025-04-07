
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
      
      console.log("Availability check response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;
    }
  }
};

export default calendarService;
