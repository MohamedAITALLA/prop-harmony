
// Notification related types

export interface Notification {
  _id: string;
  user_id: string;
  property_id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
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
