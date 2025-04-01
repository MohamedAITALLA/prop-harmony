import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification, NotificationSettings } from "@/types/api-responses";
import { toast } from "sonner";
import { notificationService } from "@/services/api-service";
import { NotificationType, NotificationSeverity } from "@/types/enums";

interface NotificationFilters {
  property_id?: string;
  type?: string;
  severity?: string;
  read?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export function useNotifications(filters?: NotificationFilters) {
  const queryClient = useQueryClient();

  // Function to generate mock data for development
  const generateMockData = () => {
    const mockNotifications: Notification[] = [
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
      {
        _id: "3",
        user_id: "user1",
        property_id: "property3",
        type: NotificationType.BOOKING_CONFLICT,
        title: "Booking Conflict",
        message: "There is a booking conflict for Property C",
        severity: NotificationSeverity.CRITICAL,
        read: false,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        updated_at: new Date().toISOString(),
        age_in_hours: 5,
        is_recent: true,
      },
      {
        _id: "4",
        user_id: "user1",
        property_id: "property1",
        type: NotificationType.NEW_BOOKING,
        title: "New Booking",
        message: "You have a new booking for Property A",
        severity: NotificationSeverity.INFO,
        read: false,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        updated_at: new Date().toISOString(),
        age_in_hours: 24,
        is_recent: false,
      },
      {
        _id: "5",
        user_id: "user1",
        property_id: "property4",
        type: NotificationType.NEW_BOOKING,
        title: "New Booking",
        message: "You have a new booking for Property D",
        severity: NotificationSeverity.INFO,
        read: true,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        updated_at: new Date().toISOString(),
        age_in_hours: 48,
        is_recent: false,
      },
      {
        _id: "6",
        user_id: "user1",
        property_id: "property2",
        type: NotificationType.SYNC_FAILURE,
        title: "Sync Failed",
        message: "Calendar sync failed for Property B",
        severity: NotificationSeverity.CRITICAL,
        read: false,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
        updated_at: new Date().toISOString(),
        age_in_hours: 12,
        is_recent: true,
      },
      {
        _id: "7",
        user_id: "user1",
        property_id: "property5",
        type: NotificationType.CANCELLED_BOOKING,
        title: "Booking Cancelled",
        message: "A booking has been cancelled for Property E",
        severity: NotificationSeverity.WARNING,
        read: false,
        created_at: new Date(new Date().getTime() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
        updated_at: new Date().toISOString(),
        age_in_hours: 18,
        is_recent: true,
      },
    ];

    // Apply filters
    let filteredNotifications = [...mockNotifications];
    
    if (filters) {
      if (filters.property_id) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.property_id === filters.property_id
        );
      }
      
      if (filters.type) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.type === filters.type
        );
      }
      
      if (filters.severity) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.severity === filters.severity
        );
      }
      
      if (filters.read !== undefined) {
        filteredNotifications = filteredNotifications.filter(
          (n) => n.read === filters.read
        );
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredNotifications = filteredNotifications.filter(
          (n) => 
            n.title.toLowerCase().includes(search) || 
            n.message.toLowerCase().includes(search)
        );
      }
    }

    // Sort by creation date, most recent first
    filteredNotifications.sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    // Apply pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
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
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      try {
        const response = await notificationService.getNotifications({
          page: filters?.page,
          limit: filters?.limit,
          property_id: filters?.property_id,
          type: filters?.type,
          severity: filters?.severity,
          read: filters?.read,
          search: filters?.search,
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // Return mock data in case of error for development
        return generateMockData();
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const { data: settings = defaultSettings() } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      try {
        const response = await notificationService.getSettings();
        return response.data;
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        return defaultSettings();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  function defaultSettings(): NotificationSettings {
    return {
      email_notifications: true,
      new_booking_notifications: true,
      modified_booking_notifications: true,
      cancelled_booking_notifications: true,
      conflict_notifications: true,
      sync_failure_notifications: true,
    };
  }

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationService.markAsRead(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark notification as read.");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async (ids?: string[]) => {
      return notificationService.markAllAsRead(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read.");
    },
    onError: (error) => {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read.");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      return notificationService.deleteNotification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted.");
    },
    onError: (error) => {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification.");
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: NotificationSettings) => {
      return notificationService.updateSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Notification settings updated.");
    },
    onError: (error) => {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings.");
    },
  });

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const markAllAsRead = (ids?: string[]) => {
    markAllAsReadMutation.mutate(ids);
  };

  const deleteNotification = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  const updateSettings = (newSettings: NotificationSettings) => {
    updateSettingsMutation.mutate(newSettings);
  };

  // Parse the data to get notifications and pagination info
  const notifications = data?.notifications || [];
  const totalPages = data?.pagination?.pages || 1;
  const totalNotifications = data?.pagination?.total || 0;

  return {
    notifications,
    isLoading,
    error,
    totalPages,
    totalNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    settings,
    updateSettings,
  };
}
