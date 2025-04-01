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
  UserProfilesResponse
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
  
  getProperty: async (id: string): Promise<PropertyResponse> => {
    const response = await api.get<PropertyResponse>(`/properties/${id}`);
    return response.data;
  },
  
  createProperty: async (propertyData: Partial<{
    name: string;
    property_type: string;
    address: Record<string, any>;
    accommodates: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    amenities: Record<string, any>;
    policies: Record<string, any>;
    images: string[];
  }>): Promise<ApiResponse<{ property: Record<string, any> }>> => {
    const response = await api.post<ApiResponse<{ property: Record<string, any> }>>("/properties", propertyData);
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
    connectionData: { platform: string; ical_url: string; sync_frequency?: number }
  ): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.post<ApiResponse<Record<string, any>>>(
      `/properties/${propertyId}/ical-connections`, 
      connectionData
    );
    return response.data;
  }
};

// Calendar Event Services
export const eventService = {
  getEvents: async (
    propertyId: string,
    params?: { start_date?: string; end_date?: string; platforms?: string[] }
  ): Promise<EventsResponse> => {
    const response = await api.get<EventsResponse>(`/properties/${propertyId}/events`, { params });
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
  }
};

// Notification Services
export const notificationService = {
  getNotifications: async (
    params?: { page?: number; limit?: number; read?: boolean; type?: string }
  ): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>("/notifications", { params });
    return response.data;
  },
  
  markAsRead: async (notificationId: string): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.put<ApiResponse<Record<string, any>>>(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async (): Promise<ApiResponse<Record<string, any>>> => {
    const response = await api.put<ApiResponse<Record<string, any>>>("/notifications/read");
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
    const response = await api.delete<ApiResponse<{ profile: Record<string, any> }>>(`/admin/user-profiles/${userId}`);
    return response.data;
  }
};
