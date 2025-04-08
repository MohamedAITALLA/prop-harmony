
import api from '@/lib/api';
import { ConflictResponse, ConflictDeleteResponse } from '@/types/api-responses/conflict-types';

const conflictService = {
  /**
   * Get all conflicts for a property
   */
  getConflicts: async (propertyId: string, status?: 'active' | 'resolved' | 'ignored'): Promise<ConflictResponse> => {
    let url = `/properties/${propertyId}/conflicts`;
    if (status) {
      url += `?status=${status}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  /**
   * Delete a conflict
   */
  deleteConflict: async (propertyId: string, conflictId: string): Promise<ConflictDeleteResponse> => {
    // Always set preserve_history to true
    const response = await api.delete(`/properties/${propertyId}/conflicts/${conflictId}?preserve_history=true`);
    return response.data;
  }
};

export default conflictService;
