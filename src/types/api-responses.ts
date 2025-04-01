import { 
  PropertyType, 
  EventType, 
  EventStatus, 
  Platform, 
  ConnectionStatus, 
  NotificationType, 
  NotificationSeverity,
  ConflictType,
  ConflictSeverity,
  ConflictStatus
} from './enums';

// Authentication Responses
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_admin: boolean;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  role?: string; // Add the role property as optional
}

export interface AuthResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_at: string;
    user: User;
  };
  message: string;
  timestamp: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    user: User;
    access_token: string;
    token_type: string;
    expires_at: string;
  };
  message: string;
  timestamp: string;
}

// User Profile Responses
export interface UserPreferences {
  theme: string;
  language: string;
  timezone: string;
  date_format: string;
  time_format: string;
  currency: string;
  notifications_enabled: boolean;
}

export interface UserProfile {
  id: string;
  user_id: string;
  preferences: UserPreferences;
  contact_info: Record<string, any>;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
  timestamp: string;
  profile_status: {
    is_new: boolean;
    onboarding_completed: boolean;
    preferences_set: boolean;
    contact_info_set: boolean;
  };
}

// Property Responses
export interface Address {
  city: string;
  stateProvince: string;
  country: string;
  street?: string;
  postalCode?: string;
}

export interface Property {
  id: string;
  name: string;
  property_type: PropertyType;
  address: Address;
  accommodates: number;
  bedrooms: number;
  beds?: number;
  bathrooms: number;
  amenities?: Record<string, any>;
  policies?: Record<string, any>;
  images: string[];
  created_at?: string;
  updated_at?: string;
  location?: string;
  days_since_creation?: number;
  description?: string; // Add description property
}

export interface PropertiesResponse {
  success: boolean;
  data: {
    properties: Property[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    };
    summary: {
      total_properties: number;
      by_property_type: Record<string, number>;
      by_city: Record<string, number>;
      applied_filters: {
        property_type: string;
        city: string;
        sort: string;
      };
    };
  };
  message: string;
  timestamp: string;
}

export interface PropertyResponse {
  success: boolean;
  data: {
    property: Property;
    meta: {
      included_relations: string[];
      property_id: string;
      property_type: string;
      last_updated: string;
    };
  };
  message: string;
  timestamp: string;
}

// iCal Connection Responses
export interface ICalConnection {
  id: string;
  property_id: string;
  platform: Platform;
  ical_url: string;
  sync_frequency: number;
  status: ConnectionStatus;
  last_synced: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ICalConnectionsResponse {
  success: boolean;
  data: ICalConnection[];
  meta: {
    property_id: string;
    total: number;
    status_breakdown: Record<string, number>;
    platform_breakdown: Record<string, number>;
    active_connections: number;
  };
  message: string;
  timestamp: string;
}

// Events Responses
export interface CalendarEvent {
  id: string;
  property_id: string;
  ical_uid: string;
  platform: Platform;
  summary: string;
  description: string;
  start_date: string;
  end_date: string;
  event_type: EventType;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  success: boolean;
  data: CalendarEvent[];
  meta: {
    total: number;
    property_id: string;
    platforms: Record<string, number>;
    date_range: {
      from: string;
      to: string;
    };
  };
  message: string;
  timestamp: string;
}

// Conflicts Responses
export interface Conflict {
  id: string;
  property_id: string;
  event_ids: string[];
  conflict_type: ConflictType;
  start_date: string;
  end_date: string;
  severity: ConflictSeverity;
  status: ConflictStatus;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ConflictsResponse {
  success: boolean;
  data: Conflict[];
  meta: {
    total: number;
    property_id: string;
    status_filter: string;
    status_breakdown: Record<string, number>;
  };
  message: string;
  timestamp: string;
}

// Notification Responses
export interface Notification {
  id: string;
  user_id: string;
  property_id: string;
  type: NotificationType;
  title: string;
  message: string;
  severity: NotificationSeverity;
  read: boolean;
  created_at: string;
  updated_at: string;
  age_in_hours: number;
  is_recent: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    };
    summary: {
      total_count: number;
      unread_count: number;
      read_count: number;
      by_type: Record<string, number>;
    };
  };
  message: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  meta?: Record<string, any>;
}
