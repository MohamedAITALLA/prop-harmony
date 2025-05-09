
import api from "@/lib/base-api";
import { ApiResponse } from "@/types/api-responses";
import { 
  ICalConnectionsResponse, 
  ICalConnection, 
  ICalConnectionResponse
} from "@/types/api-responses/ical-types";
import { TestConnectionResponse, UpdateConnectionResponse, DeleteConnectionResponse } from "@/types/ical-connection";

export interface ICalSyncResponse {
  property_id: string;
  connection_id: string;
  platform: string;
  events_synced: number;
  events_created: number;
  events_updated: number;
  events_cancelled: number;
  sync_duration_ms: number;
  conflicts: Array<{
    conflict_id: string;
    event_ids: string[];
    overlap_start_date: string;
    overlap_end_date: string;
  }>;
  last_synced: string;
}

export const icalConnectionService = {
  // Get all connections for a property
  getConnections: (propertyId: string) => {
    return api.get<ICalConnectionsResponse>(`/properties/${propertyId}/ical-connections`);
  },
  
  // Get a specific connection
  getConnection: (propertyId: string, connectionId: string) => {
    return api.get<ICalConnectionResponse>(`/properties/${propertyId}/ical-connections/${connectionId}`);
  },
  
  // Create a new connection
  createConnection: (propertyId: string, data: { 
    platform: string; 
    ical_url: string; 
    sync_frequency?: number;
  }) => {
    return api.post<ApiResponse<ICalConnection>>(`/properties/${propertyId}/ical-connections`, data);
  },
  
  // Update an existing connection
  updateConnection: (propertyId: string, connectionId: string, data: any) => {
    return api.put<UpdateConnectionResponse>(`/properties/${propertyId}/ical-connections/${connectionId}`, data);
  },
  
  // Delete a connection
  deleteConnection: (
    propertyId: string, 
    connectionId: string, 
    preserveHistory: boolean = true,
    eventAction: 'delete' | 'deactivate' | 'convert' | 'keep' = 'keep'
  ) => {
    return api.delete<DeleteConnectionResponse>(
      `/properties/${propertyId}/ical-connections/${connectionId}?preserve_history=${preserveHistory}&event_action=${eventAction}`
    );
  },
  
  // Test a connection
  testConnection: (propertyId: string, connectionId: string) => {
    return api.post<ApiResponse<TestConnectionResponse>>(
      `/properties/${propertyId}/ical-connections/${connectionId}/test`
    );
  },
  
  // Sync a specific connection
  syncConnection: (propertyId: string, connectionId: string) => {
    return api.post<ApiResponse<ICalSyncResponse>>(
      `/properties/${propertyId}/ical-connections/${connectionId}/sync`
    );
  }
};

export default icalConnectionService;
