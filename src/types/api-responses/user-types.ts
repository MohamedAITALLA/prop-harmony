
// User related types

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

export interface UsersResponse {
  success: boolean;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }
  message: string;
  timestamp: string;
}
