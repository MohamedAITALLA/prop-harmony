
// Property related types

export interface Address {
  street?: string;
  city: string;
  state_province?: string;
  postal_code?: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Property {
  _id: string;
  name: string;
  property_type: string;
  desc?: string;
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
  bookings_count?: number;
  sync_status?: string;
  rating?: number | string;
  price_per_night?: number;
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
