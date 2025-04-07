
import api from '@/lib/api';
import { ApiResponse } from "@/types/api-responses";
import { PropertySyncResponse, PropertySyncStatusResponse } from "@/types/api-responses/sync-types";

export const syncService = {
  syncAll: () => {
    return api.post<ApiResponse<any>>('/sync');
  },
  
  syncProperty: (propertyId: string) => {
    return api.post<ApiResponse<PropertySyncResponse>>(`/properties/${propertyId}/sync`);
  },
  
  getPropertySyncStatus: (propertyId: string) => {
    return api.get<ApiResponse<PropertySyncStatusResponse>>(`/properties/${propertyId}/sync`);
  },
  
  getSyncStatus: () => {
    return api.get<ApiResponse<any>>('/sync/status');
  },
  
  getSyncLogs: (params?: any) => {
    return api.get<ApiResponse<any>>('/sync/logs', { params });
  }
};

export default syncService;
