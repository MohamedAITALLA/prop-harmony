
import api from "@/lib/base-api";

export const adminUserService = {
  getUsers: async (params?: { page?: number; limit?: number; role?: string; status?: string; search?: string }) => {
    try {
      const response = await api.get("/admin/users", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  getUser: async (id: string) => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  createUser: (data: any) => {
    return api.post("/admin/users", data);
  },
  updateUser: async (id: string, data: any) => {
    try {
      const response = await api.put(`/admin/users/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },
  deleteUser: (id: string) => {
    return api.delete(`/admin/users/${id}`);
  },
  promoteUser: (id: string) => {
    return api.put(`/admin/users/${id}/promote`, {});
  },
  demoteUser: (id: string) => {
    return api.put(`/admin/users/${id}/demote`, {});
  }
};

export default adminUserService;
