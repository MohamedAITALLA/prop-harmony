
import api from '@/lib/api';
import { 
  ConflictResponse, 
  ConflictDetailResponse, 
  ConflictDeleteResponse,
  ResolveConflictResponse,
  AutoResolveConflictResponse
} from '@/types/api-responses/conflict-types';

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
  },

  /**
   * Resolve a conflict by manually selecting which events to keep
   */
  resolveConflict: async (
    propertyId: string, 
    conflictId: string, 
    eventsToKeep: string[]
  ): Promise<ResolveConflictResponse> => {
    const response = await api.post(`/properties/${propertyId}/conflicts/${conflictId}/resolve`, {
      events_to_keep: eventsToKeep,
      resolution_strategy: 'deactivate' // Always use deactivate for safety
    });
    return response.data;
  },

  /**
   * Auto-resolve a conflict using the longest booking strategy
   */
  autoResolveConflict: async (
    propertyId: string, 
    conflictId: string
  ): Promise<AutoResolveConflictResponse> => {
    // Always use deactivate strategy
    const response = await api.post(`/properties/${propertyId}/conflicts/${conflictId}/auto-resolve?strategy=deactivate`);
    return response.data;
  }
};

export default conflictService;
