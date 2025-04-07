
// iCal connection related types
import { Property } from "./property-types";

export interface ICalConnection {
  _id: string;
  property_id: string;
  platform: string;
  ical_url: string;
  sync_frequency: number;
  status: string;
  last_synced: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICalConnectionsResponse {
  success: boolean;
  data: ICalConnection[];
  meta: {
    property_id: string;
    total: number;
    status_breakdown: Record<string, number>;
    platform_breakdown: Record<string, number>;
    active_connections: number;
  };
  message: string;
  timestamp: string;
}

export interface CreateICalConnectionDto {
  platform: string;
  ical_url: string;
  sync_frequency?: number;
}
