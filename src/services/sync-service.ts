
import api from '@/lib/api';
import { ApiResponse } from "@/types/api-responses";
import { 
  PropertySyncResponse, 
  PropertySyncStatusResponse, 
  GlobalSyncResponse,
  GlobalSyncStatusResponse,
  SyncLogsResponse
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
  },
  
  // Sync logs
  getSyncLogs: (params?: {
    search?: string;
    platform?: string;
    status?: string;
    property_id?: string;
    page?: number;
    limit?: number;
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get<ApiResponse<SyncLogsResponse>>('/sync/logs', { params });
  },

  // Download sync logs in various formats
  downloadSyncLogs: (format: 'csv' | 'json' | 'excel', params?: {
    search?: string;
    platform?: string;
    status?: string;
    property_id?: string;
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get<Blob>(`/sync/logs/download/${format}`, { 
      params,
      responseType: 'blob'
    });
  }
};

export default syncService;
