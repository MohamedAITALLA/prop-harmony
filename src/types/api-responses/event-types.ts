
// Event related types
import { Property } from "./property-types";

export interface CalendarEvent {
  _id: string;
  property_id: string;
  property?: Property;
  ical_uid: string;
  platform: string;
  summary: string;
  description: string;
  start_date: string;
  end_date: string;
  event_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  duration_days?: number;
}

export interface EventResponse {
  success: boolean;
  data: CalendarEvent;
  meta: {
    conflicts_detected?: number;
    property_id: string;
    total?: number;
    platforms?: Record<string, number>;
    date_range?: {
      from: string;
      to: string;
    };
  };
  message: string;
  timestamp: string;
}

export interface EventsResponse {
  success: boolean;
  data: CalendarEvent[];
  meta: {
    total: number;
    property_id: string;
    platforms: Record<string, number>;
    date_range?: {
      from: string;
      to: string;
    };
  };
  message: string;
  timestamp: string;
}
