
import api from "@/lib/base-api";
import { ApiResponse } from "@/types/api-responses";
import { ICalConnectionsResponse, ICalConnection } from "@/types/api-responses/ical-types";
import { TestConnectionResponse, UpdateConnectionResponse, DeleteConnectionResponse } from "@/types/ical-connection";

export const icalConnectionService = {
  getConnections: (propertyId: string) => {
    return api.get<ICalConnectionsResponse>(`/properties/${propertyId}/ical-connections`);
  },
  
  createConnection: (propertyId: string, data: { 
    platform: string; 
    ical_url: string; 
    sync_frequency?: number;
  }) => {
    return api.post<ApiResponse<ICalConnection>>(`/properties/${propertyId}/ical-connections`, data);
  },
  
  updateConnection: (propertyId: string, connectionId: string, data: any) => {
    return api.put<UpdateConnectionResponse>(`/properties/${propertyId}/ical-connections/${connectionId}`, data);
  },
  
  deleteConnection: (propertyId: string, connectionId: string, preserveHistory: boolean = true) => {
    return api.delete<DeleteConnectionResponse>(
      `/properties/${propertyId}/ical-connections/${connectionId}?preserve_history=${preserveHistory}`
    );
  },
  
  testConnection: (propertyId: string, connectionId: string) => {
    return api.post<ApiResponse<TestConnectionResponse>>(
      `/properties/${propertyId}/ical-connections/${connectionId}/test`
    );
  }
};

export default icalConnectionService;
