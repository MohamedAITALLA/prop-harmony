
import api from '@/lib/api';
import { ApiResponse } from "@/types/api-responses";
import { 
  PropertySyncResponse, 
  PropertySyncStatusResponse, 
  GlobalSyncResponse,
  GlobalSyncStatusResponse
} from "@/types/api-responses/sync-types";

export const syncService = {
  // Global sync operations
  syncAll: () => {
    return api.post<ApiResponse<GlobalSyncResponse>>('/sync');
  },
  
  // Property-specific sync operations
  syncProperty: (propertyId: string) => {
    return api.post<ApiResponse<PropertySyncResponse>>(`/properties/${propertyId}/sync`);
  },
  
  getPropertySyncStatus: (propertyId: string) => {
    return api.get<ApiResponse<PropertySyncStatusResponse>>(`/properties/${propertyId}/sync`);
  },
  
  // Global sync status
  getSyncStatus: () => {
    return api.get<ApiResponse<GlobalSyncStatusResponse>>('/sync/status');
  }
};

export default syncService;
