import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification, NotificationSettings } from "@/types/api-responses";
import { toast } from "sonner";
import { notificationService } from "@/services/notification-service";
import { NotificationType, NotificationSeverity } from "@/types/enums";
import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState(filters?.page || 1);
  const [pageSize, setPageSize] = useState(filters?.limit || 10);

  const currentFilters = {
    ...filters,
    page: currentPage,
    limit: pageSize
  };

  const generateMockData = () => {
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
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", currentFilters],
    queryFn: async () => {
      try {
        const { search, ...apiParams } = currentFilters || {};
        const response = await notificationService.getNotifications(apiParams);
        return response.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return generateMockData();
      }
    },
    staleTime: 1000 * 60,
  });

  const { data: settingsResponse } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      try {
        const response = await notificationService.getSettings();
        return response.data;
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        return { settings: defaultSettings(), user_id: "", last_updated: "" };
      }
    },
    staleTime: 1000 * 60 * 5,
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
      return notificationService.markOneAsRead(id);
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
    mutationFn: async () => {
      return notificationService.markAsRead();
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

  const notifications = data?.notifications || [];
  const totalPages = data?.pagination?.pages || 1;
  const totalNotifications = data?.pagination?.total || 0;

  let notificationSettings: NotificationSettings;
  if (settingsResponse) {
    if ('settings' in settingsResponse) {
      notificationSettings = settingsResponse.settings;
    } else {
      notificationSettings = settingsResponse as NotificationSettings;
    }
  } else {
    notificationSettings = defaultSettings();
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    notifications,
    isLoading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalNotifications,
    onPageChange: handlePageChange,
    markAsRead: (id: string) => markAsReadMutation.mutate(id),
    markAllAsRead: () => markAllAsReadMutation.mutate(),
    deleteNotification: (id: string) => deleteNotificationMutation.mutate(id),
    settings: notificationSettings,
    updateSettings: (newSettings: NotificationSettings) => updateSettingsMutation.mutate(newSettings),
  };
}
