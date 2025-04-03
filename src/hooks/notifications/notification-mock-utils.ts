
import { NotificationType, NotificationSeverity } from "@/types/enums";
import { MockNotificationData, NotificationFilters } from "./notification-types";

export function defaultSettings() {
  return {
    email_notifications: true,
    new_booking_notifications: true,
    modified_booking_notifications: true,
    cancelled_booking_notifications: true,
    conflict_notifications: true,
    sync_failure_notifications: true,
  };
}

export function generateMockData(currentFilters?: NotificationFilters): MockNotificationData {
  const mockNotifications = [
    {
      _id: "1",
      user_id: "user1",
      property_id: "property1",
      type: NotificationType.NEW_BOOKING,
      title: "New Booking",
      message: "You have a new booking for Property A",
      severity: NotificationSeverity.INFO,
      read: false,
      created_at: new Date(new Date().getTime() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      updated_at: new Date().toISOString(),
      age_in_hours: 0.5,
      is_recent: true,
    },
    {
      _id: "2",
      user_id: "user1",
      property_id: "property2",
      type: NotificationType.SYNC_FAILURE,
      title: "Sync Completed",
      message: "Calendar sync completed for Property B",
      severity: NotificationSeverity.INFO,
      read: true,
      created_at: new Date(new Date().getTime() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      updated_at: new Date().toISOString(),
      age_in_hours: 2,
      is_recent: true,
    },
  ];

  let filteredNotifications = [...mockNotifications];
  
  if (currentFilters) {
    if (currentFilters.property_id) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.property_id === currentFilters.property_id
      );
    }
    
    if (currentFilters.type) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.type === currentFilters.type
      );
    }
    
    if (currentFilters.severity) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.severity === currentFilters.severity
      );
    }
    
    if (currentFilters.read !== undefined) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.read === currentFilters.read
      );
    }
    
    if (currentFilters.search) {
      const search = currentFilters.search.toLowerCase();
      filteredNotifications = filteredNotifications.filter(
        (n) => 
          n.title.toLowerCase().includes(search) || 
          n.message.toLowerCase().includes(search)
      );
    }
  }

  filteredNotifications.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  
  const page = currentFilters?.page || 1;
  const limit = currentFilters?.limit || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedNotifications = filteredNotifications.slice(start, end);
  
  return {
    notifications: paginatedNotifications,
    pagination: {
      total: filteredNotifications.length,
      page: page,
      limit: limit,
      pages: Math.ceil(filteredNotifications.length / limit),
      has_next_page: end < filteredNotifications.length,
      has_previous_page: page > 1,
    },
    summary: {
      total_count: mockNotifications.length,
      unread_count: mockNotifications.filter(n => !n.read).length,
      read_count: mockNotifications.filter(n => n.read).length,
      by_type: mockNotifications.reduce((acc: Record<string, number>, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {})
    }
  };
}
