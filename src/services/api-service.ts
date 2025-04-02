import api from "@/lib/api";

// Property Service
export const propertyService = {
  getProperties: () => {
    return api.get("/properties");
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
