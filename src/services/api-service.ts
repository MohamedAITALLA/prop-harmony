import api from "@/lib/api";
import { ApiResponse } from "@/types/api-responses";

interface PropertyQueryParams {
  page?: number;
  limit?: number;
  property_type?: string;
  city?: string;
  sort?: string;
  status?: string;
}

// Property Service
export const propertyService = {
  getProperties: (params?: PropertyQueryParams) => {
    return api.get("/properties", { params });
  },
  getAllProperties: async (params?: PropertyQueryParams) => {
    try {
      const response = await api.get("/properties", { params });
      return response.data; // Return the data portion directly
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },
  getProperty: async (id: string) => {
    try {
      console.log("Fetching property with ID:", id);
      const response = await api.get(`/properties/${id}`);
      console.log("Property API response:", response.data);
      
      // Check if the response has the expected structure
      if (response?.data?.success && response?.data?.data?.property) {
        console.log("Property data found:", response.data.data.property);
        return response.data;
      } else if (response?.data?.property) {
        // Alternative response structure
        console.log("Property data found in alternative format:", response.data.property);
        return {
          success: true,
          data: {
            property: response.data.property
          }
        };
      } else {
        console.error("Unexpected API response structure:", response.data);
        throw new Error("Property data not found in the API response");
      }
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error);
      throw error;
    }
  },
  createProperty: (data: any) => {
    return api.post("/properties", data);
  },
  updateProperty: (id: string, data: any) => {
    return api.put(`/properties/${id}`, data);
  },
  deleteProperty: (id: string) => {
    return api.delete(`/properties/${id}`);
  },
};

// iCal Connection Service
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

// Sync Service
export const syncService = {
  syncAll: async () => {
    try {
      console.log("Syncing all properties");
      const response = await api.post("/sync");
      console.log("Sync all response:", response.data);
      return response;
    } catch (error) {
      console.error("Error syncing all properties:", error);
      throw error;
    }
  },
  syncProperty: async (propertyId: string) => {
    try {
      console.log(`Syncing property ID: ${propertyId}`);
      const response = await api.post(`/properties/${propertyId}/sync`);
      console.log("Sync property response:", response.data);
      
      // Handle different response formats
      if (response.data && typeof response.data === 'object') {
        return response;
      } else {
        throw new Error("Invalid response format from sync API");
      }
    } catch (error) {
      console.error(`Error syncing property ${propertyId}:`, error);
      throw error;
    }
  },
  getPropertySyncStatus: async (propertyId: string) => {
    try {
      console.log(`Fetching sync status for property ID: ${propertyId}`);
      const response = await api.get(`/properties/${propertyId}/sync`);
      console.log("Sync status response:", response.data);
      return response;
    } catch (error) {
      console.error(`Error fetching sync status for property ${propertyId}:`, error);
      throw error;
    }
  },
  getSyncStatus: () => {
    return api.get('/sync/status');
  }
};

// Conflict Service
export const conflictService = {
  getPropertyConflicts: (propertyId: string, params?: { status?: string; page?: number; limit?: number }) => {
    return api.get(`/properties/${propertyId}/conflicts`, { params });
  },
  deleteConflict: (propertyId: string, conflictId: string) => {
    return api.delete(`/properties/${propertyId}/conflicts/${conflictId}`);
  },
};

// Auth Service
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log("Auth service login attempt for:", email);
      const response = await api.post("/auth/login", { email, password });
      console.log("Auth service login response:", response);
      return response;
    } catch (error) {
      console.error("Authentication service error:", error);
      throw error;
    }
  },
  register: (userData: any) => {
    return api.post("/auth/register", userData);
  },
};

// Profile Service
export const profileService = {
  getProfile: () => {
    return api.get("/user-profile");
  },
  updateProfile: (data: any) => {
    return api.put("/user-profile", data);
  },
  resetProfile: () => {
    return api.post("/user-profile/reset", {});
  }
};

// Admin User Service
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

// Admin Profile Service
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

// Calendar Service
export const calendarService = {
  getCalendar: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/calendar`);
  },
  getICalFeed: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/ical-feed`);
  },
  checkAvailability: (propertyId: string, startDate: string, endDate: string) => {
    return api.get(`/properties/${propertyId}/calendar/availability`, {
      params: { start_date: startDate, end_date: endDate }
    });
  }
};
