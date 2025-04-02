
import api from "@/lib/base-api";

export const adminProfileService = {
  getUserProfiles: async (params?: { page?: number; limit?: number; sort?: string; status?: string }) => {
    try {
      const response = await api.get("/admin/user-profiles", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profiles:", error);
      throw error;
    }
  },
  getUserProfile: async (userId: string) => {
    try {
      const response = await api.get(`/admin/user-profiles/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user profile ${userId}:`, error);
      throw error;
    }
  },
  updateUserProfile: async (userId: string, data: any) => {
    try {
      const response = await api.put(`/admin/user-profiles/${userId}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user profile ${userId}:`, error);
      throw error;
    }
  },
  resetUserProfile: async (userId: string) => {
    try {
      const response = await api.post(`/admin/user-profiles/${userId}/reset`, {});
      return response.data;
    } catch (error) {
      console.error(`Error resetting user profile ${userId}:`, error);
      throw error;
    }
  }
};

export default adminProfileService;
