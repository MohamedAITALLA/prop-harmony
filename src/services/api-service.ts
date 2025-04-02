
import api from "@/lib/api";
import { ApiResponse } from "@/types/api-responses";

// Property Service
export const propertyService = {
  getProperties: (params?: { page?: number; limit?: number }) => {
    return api.get("/properties", { params });
  },
  // Adding getAllProperties as an alias to getProperties for backward compatibility
  getAllProperties: (params?: { page?: number; limit?: number }) => {
    return api.get("/properties", { params });
  },
  getProperty: (id: string) => {
    return api.get(`/properties/${id}`);
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

// Event Service is now in api-event-service.ts

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
  syncAll: () => {
    return api.post("/sync");
  },
  syncProperty: (propertyId: string) => {
    return api.post(`/properties/${propertyId}/sync`);
  },
  getPropertySyncStatus: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/sync`);
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
      const response = await api.post("/auth/login", { email, password });
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
  getUsers: (params?: { page?: number; limit?: number }) => {
    return api.get("/admin/users", { params });
  },
  getUser: (id: string) => {
    return api.get(`/admin/users/${id}`);
  },
  createUser: (data: any) => {
    return api.post("/admin/users", data);
  },
  updateUser: (id: string, data: any) => {
    return api.put(`/admin/users/${id}`, data);
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
  getUserProfiles: (params?: { page?: number; limit?: number }) => {
    return api.get("/admin/user-profiles", { params });
  },
  getUserProfile: (userId: string) => {
    return api.get(`/admin/user-profiles/${userId}`);
  },
  updateUserProfile: (userId: string, data: any) => {
    return api.put(`/admin/user-profiles/${userId}`, data);
  },
  resetUserProfile: (userId: string) => {
    return api.post(`/admin/user-profiles/${userId}/reset`, {});
  }
};

// Calendar Service - Renamed from calendarService to align with other naming
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
