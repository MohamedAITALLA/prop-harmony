
import api from "@/lib/base-api";

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
    return api.post(`/properties/${propertyId}/ical-connections/${connectionId}/test`);
  }
};

export default icalConnectionService;
