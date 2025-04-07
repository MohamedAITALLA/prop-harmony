
// Property related types
import { PropertyType } from "@/types/enums";

export interface Property {
  _id?: string;
  id?: string;
  name: string;
  desc: string;
  property_type: PropertyType;
  address: Address;
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
  images: string[];
  user_id?: string;
  created_at: string;
  updated_at: string;
  is_active?: boolean;
  sync_status?: string;
  bookings_count?: number;
  location?: string;
  days_since_creation?: number;
  rating?: string | number;
  price_per_night?: number;
  description?: string; // Backward compatibility
}

export interface Address {
  street: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyResponse {
  success: boolean;
  data: {
    property: Property;
    meta?: {
      included_relations?: string[];
      property_id: string;
      property_type: string;
      last_updated: string;
      updated_fields?: string[];
      changes_count?: number;
      images_count?: number;
      images_added?: number;
      images_deleted?: number;
    };
  };
  message: string;
  timestamp: string;
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
    summary?: {
      total_properties: number;
      by_property_type: Record<string, number>;
      by_city: Record<string, number>;
      applied_filters: Record<string, any>;
    };
  };
  message: string;
  timestamp: string;
}
