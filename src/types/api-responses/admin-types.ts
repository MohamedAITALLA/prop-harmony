
// Admin related types
import { UserProfile } from "./user-types";

export interface UserProfileWithUserDetails extends UserProfile {
  user_details?: {
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
}

export interface UserProfilesResponse {
  success: boolean;
  data: {
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
  };
  message: string;
  timestamp: string;
}

export interface AdminProfileResponse {
  success: boolean;
  data: {
    profile: UserProfileWithUserDetails;
    profile_status?: {
      onboarding_completed: boolean;
      preferences_set: boolean;
      contact_info_set: boolean;
    };
  };
  message: string;
  timestamp: string;
}

export interface AdminProfileUpdateResponse {
  success: boolean;
  data: {
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
  };
  message: string;
  timestamp: string;
}

export interface AdminProfileResetResponse {
  success: boolean;
  data: {
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
  };
  message: string;
  timestamp: string;
}
