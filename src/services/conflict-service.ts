
import api from "@/lib/base-api";

export const conflictService = {
  getPropertyConflicts: (propertyId: string, params?: { status?: string; page?: number; limit?: number }) => {
    return api.get(`/properties/${propertyId}/conflicts`, { params });
  },
  deleteConflict: (propertyId: string, conflictId: string) => {
    return api.delete(`/properties/${propertyId}/conflicts/${conflictId}`);
  },
  // Adding the resolveConflict method since components are using it
  resolveConflict: async (
    propertyId: string,
    conflictId: string,
    resolutionData: {
      resolution: string;
      notes?: string;
    }
  ) => {
    const response = await api.post(
      `/properties/${propertyId}/conflicts/${conflictId}/resolve`,
      resolutionData
    );
    return response.data;
  }
};

export default conflictService;
