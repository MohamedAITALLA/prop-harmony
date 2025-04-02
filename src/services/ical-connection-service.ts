
import api from "@/lib/base-api";
import { ApiResponse } from "@/types/api-responses";

// Define the test response interface to match API schema
interface TestConnectionResponse {
  valid: boolean;
  connection: {
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
  };
  error?: string;
}

interface TestConnectionMeta {
  property_id: string;
  connection_id: string;
  platform: string;
  status: string;
  tested_at: string;
}

export const icalConnectionService = {
  getConnections: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/ical-connections`);
  },
  createConnection: (propertyId: string, data: any) => {
    return api.post(`/properties/${propertyId}/ical-connections`, data);
  },
  updateConnection: (propertyId: string, connectionId: string, data: any) => {
    return api.put(`/properties/${propertyId}/ical-connections/${connectionId}`, data);
  },
  deleteConnection: (propertyId: string, connectionId: string) => {
    return api.delete(`/properties/${propertyId}/ical-connections/${connectionId}`);
  },
  testConnection: (propertyId: string, connectionId: string) => {
    return api.post<ApiResponse<TestConnectionResponse>>(
      `/properties/${propertyId}/ical-connections/${connectionId}/test`
    );
  }
};

export default icalConnectionService;
