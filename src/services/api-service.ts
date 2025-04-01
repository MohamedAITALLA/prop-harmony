import api from "@/lib/api";
import { 
  AuthResponse, 
  RegisterResponse, 
  ProfileResponse,
  PropertiesResponse,
  PropertyResponse,
  ICalConnectionsResponse,
  EventsResponse,
  ConflictsResponse,
  NotificationsResponse,
  ApiResponse,
  UsersResponse,
  UserProfilesResponse,
  SyncLogsResponse,
  User,
  ICalConnection,
  CalendarEvent
} from "@/types/api-responses";

// Authentication Services
export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", { email, password });
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<RegisterResponse> => {
    const apiData = {
      email: userData.email,
      password: userData.password,
      first_name: userData.firstName,
      last_name: userData.lastName,
    };
    
    const response = await api.post<RegisterResponse>("/auth/register", apiData);
    return response.data;
  },

  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>("/auth/me");
    return response.data;
  }
};

// User Profile Services
export const profileService = {
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/user-profile");
    return response.data;
  },
  
  updateProfile: async (profileData: Partial<{
    preferences: Record<string, any>;
    contact_info: Record<string, any>;
    onboarding_completed: boolean;
    password_update: { current: string; new: string };
    preferences_reset: boolean;
  }>): Promise<ProfileResponse> => {
    const response = await api.put<ProfileResponse>("/user-profile", profileData);
    return response.data;
  },
  
  resetProfile: async (): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>("/user-profile/reset");
    return response.data;
  }
};

// Property Services
export const propertyService = {
  getAllProperties: async (params?: {
    page?: number;
    limit?: number;
    property_type?: string;
    city?: string;
    sort?: string;
  }): Promise<PropertiesResponse> => {
    const response = await api.get<PropertiesResponse>("/properties", { params });
    return response.data;
  },
  
  getProperty: async (id: string, include?: string): Promise<PropertyResponse> => {
    const params = include ? { include } : undefined;
    const response = await api.get<PropertyResponse>(`/properties/${id}`, { params });
    return response.data;
  },
  
  createProperty: async (propertyData: {
    name: string;
    property_type: string;
    address: {
      street: string;
      city: string;
      state_province: string;
      postal_code: string;
      country: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    accommodates: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    amenities?: {
      wifi?: boolean;
      kitchen?: boolean;
      ac?: boolean;
      heating?: boolean;
      tv?: boolean;
      washer?: boolean;
      dryer?: boolean;
      parking?: boolean;
      elevator?: boolean;
      pool?: boolean;
    };
    policies?: {
      check_in_time?: string;
      check_out_time?: string;
      minimum_stay?: number;
      pets_allowed?: boolean;
      smoking_allowed?: boolean;
    };
    images?: string[];
  }): Promise<PropertyResponse> => {
    const response = await api.post<PropertyResponse>("/properties", propertyData);
    return response.data;
  },
  
  updateProperty: async (
    id: string, 
    propertyData: Partial<{
      name: string;
      property_type: string;
      address: Partial<{
        street: string;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
      }>;
      accommodates: number;
      bedrooms: number;
      beds: number;
      bathrooms: number;
      amenities: Partial<{
        wifi: boolean;
        kitchen: boolean;
        ac: boolean;
        heating: boolean;
        tv: boolean;
        washer: boolean;
        dryer: boolean;
        parking: boolean;
        elevator: boolean;
        pool: boolean;
      }>;
      policies: Partial<{
        check_in_time: string;
        check_out_time: string;
        minimum_stay: number;
        pets_allowed: boolean;
        smoking_allowed: boolean;
      }>;
      images: string[];
    }>
  ): Promise<PropertyResponse> => {
    const response = await api.put<PropertyResponse>(`/properties/${id}`, propertyData);
    return response.data;
  },
  
  deleteProperty: async (id: string, preserveHistory?: boolean): Promise<ApiResponse<{ success: boolean }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/properties/${id}`, { params });
    return response.data;
  },
  
  getICalFeedUrl: (propertyId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/api/properties/${propertyId}/ical-feed`;
  }
};

// iCal Connection Services
export const icalConnectionService = {
  getConnections: async (propertyId: string): Promise<ICalConnectionsResponse> => {
    const response = await api.get<ICalConnectionsResponse>(`/properties/${propertyId}/ical-connections`);
    return response.data;
  },
  
  createConnection: async (
    propertyId: string, 
    connectionData: { 
      platform: string; 
      ical_url: string; 
      sync_frequency?: number 
    }
  ): Promise<ApiResponse<ICalConnection>> => {
    const response = await api.post<ApiResponse<ICalConnection>>(
      `/properties/${propertyId}/ical-connections`, 
      connectionData
    );
    return response.data;
  },

  getConnection: async (propertyId: string, connectionId: string): Promise<ApiResponse<ICalConnection>> => {
    const response = await api.get<ApiResponse<ICalConnection>>(
      `/properties/${propertyId}/ical-connections/${connectionId}`
    );
    return response.data;
  },

  updateConnection: async (
    propertyId: string,
    connectionId: string,
    connectionData: Partial<{
      platform: string;
      ical_url: string;
      sync_frequency: number;
      status: string;
      error_message: Record<string, any>;
    }>
  ): Promise<ApiResponse<ICalConnection>> => {
    const response = await api.put<ApiResponse<ICalConnection>>(
      `/properties/${propertyId}/ical-connections/${connectionId}`,
      connectionData
    );
    return response.data;
  },

  deleteConnection: async (
    propertyId: string, 
    connectionId: string,
    preserveHistory?: boolean
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/ical-connections/${connectionId}`, 
      { params }
    );
    return response.data;
  },

  testConnection: async (
    propertyId: string,
    connectionId: string
  ): Promise<ApiResponse<{ success: boolean; results: Record<string, any> }>> => {
    const response = await api.post<ApiResponse<{ success: boolean; results: Record<string, any> }>>(
      `/properties/${propertyId}/ical-connections/${connectionId}/test`
    );
    return response.data;
  }
};

// Calendar and Event Services
export const calendarService = {
  getCalendar: async (
    propertyId: string,
    params?: {
      start_date?: string;
      end_date?: string;
      platforms?: string[];
      event_types?: string[];
    }
  ): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.get<ApiResponse<Record<string, any>>>(
      `/properties/${propertyId}/calendar`,
      { params }
    );
    return response.data;
  },
  
  checkAvailability: async (
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{ available: boolean; conflicts?: any[] }>> => {
    const params = { start_date: startDate, end_date: endDate };
    const response = await api.get<ApiResponse<{ available: boolean; conflicts?: any[] }>>(
      `/properties/${propertyId}/calendar/availability`,
      { params }
    );
    return response.data;
  },
  
  getICalFeed: async (propertyId: string): Promise<ApiResponse<string>> => {
    const response = await api.get<ApiResponse<string>>(
      `/properties/${propertyId}/ical-feed`
    );
    return response.data;
  }
};

// Calendar Event Services
export const eventService = {
  getEvents: async (
    propertyId: string,
    params?: {
      start_date?: string;
      end_date?: string;
      platforms?: string[];
      event_types?: string[];
    }
  ): Promise<EventsResponse> => {
    const response = await api.get<EventsResponse>(
      `/properties/${propertyId}/events`,
      { params }
    );
    return response.data;
  },
  
  createEvent: async (
    propertyId: string,
    eventData: {
      platform?: string;
      summary: string;
      start_date: string;
      end_date: string;
      event_type: string;
      status?: string;
      description?: string;
    }
  ): Promise<ApiResponse<CalendarEvent>> => {
    const response = await api.post<ApiResponse<CalendarEvent>>(
      `/properties/${propertyId}/events`,
      eventData
    );
    return response.data;
  },
  
  deleteEvent: async (
    propertyId: string,
    eventId: string,
    preserveHistory?: boolean
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{ success: boolean }>>(
      `/properties/${propertyId}/events/${eventId}`,
      { params }
    );
    return response.data;
  }
};

// Conflict Services
export const conflictService = {
  getConflicts: async (
    propertyId: string,
    params?: { status?: string }
  ): Promise<ConflictsResponse> => {
    const response = await api.get<ConflictsResponse>(`/properties/${propertyId}/conflicts`, { params });
    return response.data;
  },
  
  deleteConflict: async (propertyId: string, conflictId: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(`/properties/${propertyId}/conflicts/${conflictId}`);
    return response.data;
  }
};

// Notification Services
export const notificationService = {
  getNotifications: async (
    params?: { 
      page?: number; 
      limit?: number; 
      property_id?: string;
      type?: string; 
      severity?: string;
      read?: boolean;
    }
  ): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>("/notifications", { params });
    return response.data;
  },
  
  markAsRead: async (notificationId: string): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.put<ApiResponse<Record<string, any>>>(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async (ids?: string[]): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.put<ApiResponse<Record<string, any>>>("/notifications/read", ids ? { ids } : undefined);
    return response.data;
  },
  
  deleteNotification: async (
    notificationId: string, 
    preserveHistory?: boolean
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/notifications/${notificationId}`, { params });
    return response.data;
  },
  
  getSettings: async (): Promise<ApiResponse<{
    email_notifications: boolean;
    new_booking_notifications: boolean;
    modified_booking_notifications: boolean;
    cancelled_booking_notifications: boolean;
    conflict_notifications: boolean;
    sync_failure_notifications: boolean;
  }>> => {
    const response = await api.get<ApiResponse<Record<string, boolean>>>("/notifications/settings");
    return response.data;
  },
  
  updateSettings: async (settings: {
    email_notifications?: boolean;
    new_booking_notifications?: boolean;
    modified_booking_notifications?: boolean;
    cancelled_booking_notifications?: boolean;
    conflict_notifications?: boolean;
    sync_failure_notifications?: boolean;
  }): Promise<ApiResponse<Record<string, boolean>>> => {
    const response = await api.put<ApiResponse<Record<string, boolean>>>("/notifications/settings", settings);
    return response.data;
  }
};

// Admin User Management Services
export const adminUserService = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<UsersResponse> => {
    const response = await api.get<UsersResponse>("/admin/users", { params });
    return response.data;
  },
  
  getUser: async (id: string): Promise<ApiResponse<{ user: Record<string, any> }>> => {
    const response = await api.get<ApiResponse<{ user: Record<string, any> }>>(`/admin/users/${id}`);
    return response.data;
  },
  
  createUser: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_active?: boolean;
    role?: string;
  }): Promise<ApiResponse<{ user: Record<string, any> }>> => {
    const response = await api.post<ApiResponse<{ user: Record<string, any> }>>("/admin/users", userData);
    return response.data;
  },
  
  updateUser: async (id: string, userData: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    password?: string;
    is_active: boolean;
    role: string;
  }>): Promise<ApiResponse<{ user: Record<string, any> }>> => {
    const response = await api.put<ApiResponse<{ user: Record<string, any> }>>(`/admin/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id: string): Promise<ApiResponse<{}>> => {
    const response = await api.delete<ApiResponse<{}>>(`/admin/users/${id}`);
    return response.data;
  },
  
  promoteUser: async (id: string): Promise<ApiResponse<{ user: Record<string, any> }>> => {
    const response = await api.put<ApiResponse<{ user: Record<string, any> }>>(`/admin/users/${id}/promote`);
    return response.data;
  },
  
  demoteUser: async (id: string): Promise<ApiResponse<{ user: Record<string, any> }>> => {
    const response = await api.put<ApiResponse<{ user: Record<string, any> }>>(`/admin/users/${id}/demote`);
    return response.data;
  }
};

// Admin User Profile Management Services
export const adminProfileService = {
  getUserProfiles: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<UserProfilesResponse> => {
    const response = await api.get<UserProfilesResponse>("/admin/user-profiles", { params });
    return response.data;
  },
  
  getUserProfile: async (userId: string): Promise<ApiResponse<{ profile: Record<string, any> }>> => {
    const response = await api.get<ApiResponse<{ profile: Record<string, any> }>>(`/admin/user-profiles/${userId}`);
    return response.data;
  },
  
  updateUserProfile: async (userId: string, profileData: Partial<{
    preferences: Record<string, any>;
    onboarding_completed: boolean;
  }>): Promise<ApiResponse<{ profile: Record<string, any> }>> => {
    const response = await api.put<ApiResponse<{ profile: Record<string, any> }>>(`/admin/user-profiles/${userId}`, profileData);
    return response.data;
  },
  
  resetUserProfile: async (userId: string): Promise<ApiResponse<{ profile: Record<string, any> }>> => {
    const response = await api.post<ApiResponse<{ profile: Record<string, any> }>>(`/admin/user-profiles/${userId}/reset`);
    return response.data;
  }
};

// Sync Services
export const syncService = {
  getSyncStatus: async (): Promise<ApiResponse<{ syncStatus: Record<string, any> }>> => {
    const response = await api.get<ApiResponse<{ syncStatus: Record<string, any> }>>("/sync/status");
    return response.data;
  },
  
  syncAll: async (): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>("/sync");
    return response.data;
  },
  
  getPropertySyncStatus: async (propertyId: string): Promise<ApiResponse<{ syncStatus: Record<string, any> }>> => {
    const response = await api.get<ApiResponse<{ syncStatus: Record<string, any> }>>(`/properties/${propertyId}/sync`);
    return response.data;
  },
  
  syncProperty: async (propertyId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.post<ApiResponse<{ success: boolean }>>(`/properties/${propertyId}/sync`);
    return response.data;
  },
  
  getSyncSchedule: async (): Promise<ApiResponse<{ schedule: Array<Record<string, any>> }>> => {
    const response = await api.get<ApiResponse<{ schedule: Array<Record<string, any>> }>>("/sync/schedule");
    return response.data;
  },
  
  getSyncLogs: async (params?: { 
    property_id?: string; 
    platform?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    page?: number;
    limit?: number;
  }): Promise<SyncLogsResponse> => {
    const response = await api.get<SyncLogsResponse>("/sync/logs", { params });
    return response.data;
  },
  
  getPropertySyncLogs: async (
    propertyId: string,
    params?: { 
      platform?: string;
      status?: string;
      start_date?: string;
      end_date?: string;
      page?: number;
      limit?: number;
    }
  ): Promise<SyncLogsResponse> => {
    const response = await api.get<SyncLogsResponse>(`/properties/${propertyId}/sync`, { params });
    return response.data;
  }
};
