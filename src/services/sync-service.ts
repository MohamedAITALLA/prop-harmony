
import { api } from '@/lib/api';

export const syncService = {
  syncAll: () => {
    return api.post('/sync');
  },
  
  syncProperty: (propertyId: string) => {
    return api.post(`/sync/properties/${propertyId}`);
  },
  
  getPropertySyncStatus: (propertyId: string) => {
    return api.get(`/sync/properties/${propertyId}/status`);
  },
  
  getSyncStatus: () => {
    return api.get('/sync/status');
  },
  
  getSyncLogs: (params?: any) => {
    return api.get('/sync/logs', { params });
  }
};
