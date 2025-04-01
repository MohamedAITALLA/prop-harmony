// API response types with only _id fields
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
  ConflictStatus,
  SyncLogStatus,
  SyncAction
} from './enums';

// Authentication Responses
export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
  theme?: "light" | "dark" | "system";
  language?: "en" | "es" | "fr" | "de";
  timezone?: string;
  date_format?: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  time_format?: "12h" | "24h";
  currency?: "USD" | "EUR" | "GBP" | "CAD" | "AUD";
  notifications_enabled?: boolean;
}

export interface UserProfile {
  _id: string;
  user_id: string;
  preferences: UserPreferences;
  contact_info: Record<string, any>;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  user_details?: {
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
  message: string;
  timestamp: string;
  profile_status?: {
    is_new: boolean;
    onboarding_completed: boolean;
    preferences_set: boolean;
    contact_info_set: boolean;
  };
}

export interface ProfileUpdateResponse {
  success: boolean;
  data: UserProfile;
  message: string;
  timestamp: string;
  updated_fields?: string[];
  profile_status?: {
    onboarding_completed: boolean;
    preferences_set: boolean;
    contact_info_set: boolean;
  };
}

export interface ProfileResetResponse {
  success: boolean;
  data: UserProfile;
  message: string;
  timestamp: string;
  action: string;
  previous_settings?: {
    had_preferences: boolean;
    had_contact_info: boolean;
    was_onboarded: boolean;
  };
  current_settings?: {
    has_preferences: boolean;
    has_contact_info: boolean;
    is_onboarded: boolean;
  };
}

// Property Responses
export interface Address {
  city: string;
  stateProvince: string;
  country: string;
  street?: string;
  postalCode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Property {
  _id: string;
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
  description?: string;
  bookings_count?: number;
  sync_status?: string;
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

export interface PropertyCreateResponse {
  success: boolean;
  data: {
    property: Property;
    meta: {
      property_id: string;
      created_at: string;
      property_type: string;
      location: string;
    }
  };
  message: string;
  timestamp: string;
}

export interface PropertyUpdateResponse {
  success: boolean;
  data: {
    property: Property;
    meta: {
      property_id: string;
      updated_fields: string[];
      update_time: string;
      changes_count: number;
    }
  };
  message: string;
  timestamp: string;
}

export interface PropertyDeleteResponse {
  success: boolean;
  data: {
    property: {
      _id: string;
      name: string;
      property_type: string;
      location: string;
    };
    meta: {
      action: "deactivate" | "delete";
      preserve_history: boolean;
      property_id: string;
      action_time: string;
    }
  };
  message: string;
  timestamp: string;
}

// iCal Connection Responses
export interface ICalConnection {
  _id: string;
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
  _id: string;
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
  _id: string;
  property_id: string;
  property?: {
    _id: string;
    name: string;
  };
  event_ids: string[];
  conflict_type: ConflictType;
  start_date: string;
  end_date: string;
  severity: ConflictSeverity;
  status: ConflictStatus;
  description: string;
  created_at: string;
  updated_at: string;
  platforms?: string[];
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
  _id: string;
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

export interface NotificationSettings {
  email_notifications: boolean;
  new_booking_notifications: boolean;
  modified_booking_notifications: boolean;
  cancelled_booking_notifications: boolean;
  conflict_notifications: boolean;
  sync_failure_notifications: boolean;
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

// Sync Log Responses
export interface SyncLog {
  _id: string;
  property_id: string;
  property?: {
    _id: string;
    name: string;
  };
  platform: Platform;
  action: SyncAction;
  status: SyncLogStatus;
  timestamp: string;
  duration: number;
  message: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface SyncLogsResponse {
  success: boolean;
  data: {
    logs: SyncLog[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
      has_next_page: boolean;
      has_previous_page: boolean;
    };
    summary?: {
      by_status: Record<string, number>;
      by_platform: Record<string, number>;
      by_property: Record<string, number>;
      total_count: number;
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

export interface UsersResponse extends ApiResponse<{
  users: User[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}> {}

// Admin Profile Management Responses
export interface UserProfileWithUserDetails extends UserProfile {
  user_details?: {
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}

export interface UserProfilesResponse extends ApiResponse<{
  profiles: UserProfile[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  meta?: {
    profiles_with_onboarding_completed?: number;
    profiles_with_contact_info?: number;
    has_next_page?: boolean;
    has_previous_page?: boolean;
    next_page?: number | null;
    previous_page?: number | null;
  };
}> {}

export interface AdminProfileResponse extends ApiResponse<{
  profile: UserProfileWithUserDetails;
  profile_status?: {
    onboarding_completed: boolean;
    preferences_set: boolean;
    contact_info_set: boolean;
  };
}> {}

export interface AdminProfileUpdateResponse extends ApiResponse<{
  profile: UserProfileWithUserDetails;
  updated_by: string;
  updated_fields: string[];
  previous_values: {
    preferences: Record<string, any>;
    contact_info: Record<string, any>;
    onboarding_completed: boolean;
  };
  profile_status: {
    onboarding_completed: boolean;
    preferences_set: boolean;
    contact_info_set: boolean;
  };
}> {}

export interface AdminProfileResetResponse extends ApiResponse<{
  profile: UserProfileWithUserDetails;
  action: string;
  reset_by: string;
  previous_state: {
    preferences: Record<string, any>;
    contact_info: Record<string, any>;
    onboarding_completed: boolean;
    had_preferences: boolean;
    had_contact_info: boolean;
  };
  current_state: {
    preferences: Record<string, any>;
    contact_info: Record<string, any>;
    onboarding_completed: boolean;
  };
}> {}
