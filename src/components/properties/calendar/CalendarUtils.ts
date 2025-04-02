
import { Platform, EventType } from "@/types/enums";

export const getEventColor = (platform?: Platform, eventType?: EventType): string => {
  if (eventType === EventType.BLOCKED) return "#ef4444";
  if (eventType === EventType.MAINTENANCE) return "#f97316";
  
  switch (platform) {
    case Platform.AIRBNB:
      return "#ff5a5f";
    case Platform.VRBO:
      return "#3b5998";
    case Platform.BOOKING:
      return "#003580";
    case Platform.MANUAL:
      return "#10b981";
    default:
      return "#6366f1";
  }
};

export const createICalFeedUrl = (propertyId: string): string => {
  return `https://channel-manager-api.vercel.app/properties/${propertyId}/ical-feed`;
};
