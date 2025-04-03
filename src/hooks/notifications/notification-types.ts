
import { Notification, NotificationSettings } from "@/types/api-responses";
import { NotificationType, NotificationSeverity } from "@/types/enums";

export interface NotificationFilters {
  property_id?: string;
  type?: string;
  severity?: string;
  read?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface MockNotificationData {
  notifications: Array<Notification & { age_in_hours: number; is_recent: boolean; }>;
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
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalNotifications: number;
  onPageChange: (page: number) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  settings: NotificationSettings;
  updateSettings: (newSettings: NotificationSettings) => void;
}
