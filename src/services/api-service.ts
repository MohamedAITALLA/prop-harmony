
import api from "@/lib/api";

// Property Service
export const propertyService = {
  getProperties: () => {
    return api.get("/properties");
  },
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

// Event Service
export const eventService = {
  getEvents: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/events`);
  },
  createEvent: (propertyId: string, data: any) => {
    return api.post(`/properties/${propertyId}/events`, data);
  },
  updateEvent: (propertyId: string, eventId: string, data: any) => {
    return api.put(`/properties/${propertyId}/events/${eventId}`, data);
  },
  deleteEvent: (propertyId: string, eventId: string) => {
    return api.delete(`/properties/${propertyId}/events/${eventId}`);
  },
};

// iCal Connection Service
export const icalConnectionService = {
  getConnections: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/ical`);
  },
  createConnection: (propertyId: string, data: any) => {
    return api.post(`/properties/${propertyId}/ical`, data);
  },
  updateConnection: (propertyId: string, connectionId: string, data: any) => {
    return api.put(`/properties/${propertyId}/ical/${connectionId}`, data);
  },
  deleteConnection: (propertyId: string, connectionId: string) => {
    return api.delete(`/properties/${propertyId}/ical/${connectionId}`);
  },
  testConnection: (propertyId: string, connectionId: string) => {
    return api.get(`/properties/${propertyId}/ical/${connectionId}/test`);
  }
};

// Sync Service
export const syncService = {
  syncAll: (data = {}) => {
    return api.post("/sync", data);
  },
  syncProperty: (propertyId: string, data = {}) => {
    return api.post(`/properties/${propertyId}/sync`, data);
  },
  getPropertySyncStatus: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/sync-status`);
  },
  getSyncStatus: () => {
    return api.get('/sync-status');
  }
};

// Notification Service
export const notificationService = {
  getNotifications: () => {
    return api.get("/notifications");
  },
  markAsRead: (id: string) => {
    return api.put(`/notifications/${id}/read`, {});
  },
  markAllAsRead: () => {
    return api.put("/notifications/read-all", {});
  },
  deleteNotification: (id: string) => {
    return api.delete(`/notifications/${id}`);
  }
};

// Calendar Service
export const calendarService = {
  getICalFeed: (propertyId: string) => {
    return api.get(`/properties/${propertyId}/ical-feed`);
  },
  checkAvailability: (propertyId: string, startDate: string, endDate: string) => {
    return api.get(`/properties/${propertyId}/availability`, {
      params: { start_date: startDate, end_date: endDate }
    });
  }
};

// Auth Service
export const authService = {
  login: (email: string, password: string) => {
    return api.post("/auth/login", { email, password });
  },
  register: (userData: any) => {
    return api.post("/auth/register", userData);
  },
  getCurrentUser: () => {
    return api.get("/auth/me");
  },
  forgotPassword: (email: string) => {
    return api.post("/auth/forgot-password", { email });
  },
  resetPassword: (token: string, password: string) => {
    return api.post("/auth/reset-password", { token, password });
  },
  verifyEmail: (token: string) => {
    return api.post("/auth/verify-email", { token });
  }
};

// Profile Service
export const profileService = {
  getProfile: () => {
    return api.get("/profile");
  },
  updateProfile: (data: any) => {
    return api.put("/profile", data);
  },
  resetProfile: () => {
    return api.post("/profile/reset", {});
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
  }
};

// Admin Profile Service
export const adminProfileService = {
  getUserProfiles: (params?: { page?: number; limit?: number }) => {
    return api.get("/admin/profiles", { params });
  },
  getUserProfile: (userId: string) => {
    return api.get(`/admin/profiles/${userId}`);
  },
  updateUserProfile: (userId: string, data: any) => {
    return api.put(`/admin/profiles/${userId}`, data);
  },
  resetUserProfile: (userId: string) => {
    return api.post(`/admin/profiles/${userId}/reset`, {});
  }
};

// Conflict Service
export const conflictService = {
  getAllConflicts: (params?: { status?: string; page?: number; limit?: number }) => {
    return api.get("/conflicts", { params });
  },
  getPropertyConflicts: (propertyId: string, params?: { status?: string; page?: number; limit?: number }) => {
    return api.get(`/properties/${propertyId}/conflicts`, { params });
  },
  getConflict: (conflictId: string) => {
    return api.get(`/conflicts/${conflictId}`);
  },
  resolveConflict: (conflictId: string, resolution: { resolution: string; event_id?: string }) => {
    return api.post(`/conflicts/${conflictId}/resolve`, resolution);
  },
  // Adding the missing getConflicts method
  getConflicts: (propertyId: string, params?: { status?: string; page?: number; limit?: number }) => {
    return api.get(`/properties/${propertyId}/conflicts`, { params });
  }
};
