
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
  ApiResponse
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
    // Convert from camelCase to snake_case for API
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
    // This function returns the URL for the property's iCal feed
    // In a real app, this would include the domain of your deployed app
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
