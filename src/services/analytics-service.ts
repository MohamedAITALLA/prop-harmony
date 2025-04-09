
import api from "@/lib/api";

export interface DashboardAnalytics {
  success: boolean;
  data: {
    total_properties: number;
    active_bookings: number;
    upcoming_bookings: Array<{
      id: string;
      property_id: string;
      summary: string;
      start_date: string;
      end_date: string;
      platform: string;
      days_until: number;
    }>;
    active_conflicts: number;
    connection_health: {
      total: number;
      active: number;
      error: number;
      inactive: number;
    };
    health_score: number;
    current_occupancy_rate: number;
    system_health_status: string;
    alerts: Array<{
      type: string;
      severity: string;
      message: string;
    }>;
  };
  message: string;
  timestamp: string;
}

export interface PropertyAnalytics {
  success: boolean;
  data: {
    total_properties: number;
    active_properties: number;
    property_types: Array<{
      _id: string;
      count: number;
    }>;
    average_bedrooms?: number;
    average_bathrooms?: number;
    average_accommodates?: number;
    amenities_distribution?: Array<{
      amenity: string;
      count: number;
      percentage: string;
    }>;
  };
  message: string;
  timestamp: string;
}

export interface BookingAnalytics {
  success: boolean;
  data: {
    total_bookings: number;
    active_bookings: number;
    bookings_by_platform: Array<{
      _id: string;
      count: number;
    }>;
    bookings_by_month: Array<{
      year: number;
      month: number;
      month_name: string;
      count: number;
      period: string;
    }>;
    average_booking_duration: string;
    occupancy_by_month: Array<{
      year: number;
      month: number;
      month_name: string;
      occupancy_rate: string;
      occupied_days: number;
      total_days: number;
    }>;
    cancelled_bookings: number;
    cancelled_rate: string;
  };
  message: string;
  timestamp: string;
}

export interface PlatformAnalytics {
  success: boolean;
  data: {
    connections_by_platform: Array<{
      _id: string;
      count: number;
    }>;
    connections_by_status: Array<{
      _id: string;
      count: number;
    }>;
    bookings_by_platform: Array<{
      _id: string;
      count: number;
    }>;
    sync_errors_by_platform: Array<{
      _id: string;
      count: number;
    }>;
    platform_performance_scores: Array<{
      platform: string;
      connections_count: number;
      active_connections: number;
      error_connections: number;
      reliability_score: string;
      bookings_count: number;
      average_booking_duration: string;
      last_synced: string;
    }>;
    most_reliable_platform: {
      platform: string;
      reliability_score: string;
    };
    most_active_platform: {
      _id: string;
      count: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface CalendarAnalytics {
  success: boolean;
  data: {
    events_by_type: Array<{
      _id: string;
      count: number;
    }>;
    total_conflicts: number;
    active_conflicts: number;
    occupancy_rate: string;
    availability_by_month: Array<{
      year: number;
      month: number;
      month_name: string;
      occupancy_rate: string;
      availability_rate: string;
      occupied_days: number;
      total_days: number;
    }>;
  };
  message: string;
  timestamp: string;
}

export interface UserActivityAnalytics {
  success: boolean;
  data: {
    total_properties: number;
    total_connections: number;
    connection_health: {
      total: number;
      active: number;
      error: number;
      inactive: number;
    };
    health_score: number;
    recent_sync_activity: Array<{
      platform: string;
      property_id: string;
      last_synced: string;
      status: string;
      error_message?: string;
    }>;
    platforms_used: string[];
    system_health_status: string;
    recommended_actions: string[];
  };
  message: string;
  timestamp: string;
}

export interface PropertyComparisonAnalytics {
  success: boolean;
  data: {
    comparison_data: Array<{
      property_id: string;
      property_name: string;
      property_type: string;
      total_bookings: number;
      active_bookings: number;
      occupancy_rate: string;
      average_booking_duration: string;
      platforms_connected: number;
      platforms: string[];
      location: string;
    }>;
    best_performing: {
      property_id: string;
      property_name: string;
      occupancy_rate: string;
    };
    property_count: number;
  };
  message: string;
  timestamp: string;
}

class AnalyticsService {
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      const response = await api.get('/analytics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }

  async getPropertyAnalytics(propertyId?: string): Promise<PropertyAnalytics> {
    try {
      const params = propertyId ? { property_id: propertyId } : {};
      const response = await api.get('/analytics/properties', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching property analytics:', error);
      throw error;
    }
  }

  async getBookingAnalytics(options?: {
    propertyId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<BookingAnalytics> {
    try {
      const params = {
        property_id: options?.propertyId,
        start_date: options?.startDate,
        end_date: options?.endDate
      };
      
      const response = await api.get('/analytics/bookings', { 
        params: Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined)
        ) 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching booking analytics:', error);
      throw error;
    }
  }

  async getPlatformAnalytics(propertyId?: string): Promise<PlatformAnalytics> {
    try {
      const params = propertyId ? { property_id: propertyId } : {};
      const response = await api.get('/analytics/platforms', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      throw error;
    }
  }

  async getCalendarAnalytics(options?: {
    propertyId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<CalendarAnalytics> {
    try {
      const params = {
        property_id: options?.propertyId,
        start_date: options?.startDate,
        end_date: options?.endDate
      };
      
      const response = await api.get('/analytics/calendar', { 
        params: Object.fromEntries(
          Object.entries(params).filter(([_, v]) => v !== undefined)
        ) 
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching calendar analytics:', error);
      throw error;
    }
  }

  async getUserActivityAnalytics(): Promise<UserActivityAnalytics> {
    try {
      const response = await api.get('/analytics/user-activity');
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity analytics:', error);
      throw error;
    }
  }

  async compareProperties(propertyIds: string[]): Promise<PropertyComparisonAnalytics> {
    try {
      const params = { property_ids: propertyIds.join(',') };
      const response = await api.get('/analytics/compare', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching property comparison:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();
