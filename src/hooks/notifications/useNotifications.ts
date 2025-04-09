
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification, NotificationSettings } from "@/types/api-responses/notification-types";
import { useState } from "react";
import { notificationService } from "@/services/notification-service";
import { NotificationFilters, UseNotificationsReturn } from "./notification-types";
import { generateMockData, defaultSettings } from "./notification-mock-utils";
import { useNotificationMutations } from "./notification-mutations";

export function useNotifications(filters?: NotificationFilters): UseNotificationsReturn {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(filters?.page || 1);
  const [pageSize, setPageSize] = useState(filters?.limit || 10);

  const currentFilters = {
    ...filters,
    page: currentPage,
    limit: pageSize
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications", currentFilters],
    queryFn: async () => {
      try {
        const { search, ...apiParams } = currentFilters || {};
        const response = await notificationService.getNotifications(apiParams);
        // Make sure to invalidate the unread count when loading notifications
        queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
        return response.data;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        return generateMockData(currentFilters);
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

  // Get mutations
  const {
    markAsReadMutation,
    markAllAsReadMutation,
    deleteNotificationMutation,
    updateSettingsMutation
  } = useNotificationMutations(queryClient);

  // Process notifications data
  const notifications = Array.isArray(data) ? data : (data?.notifications || []);
  const pagination = Array.isArray(data) ? { 
    total: data.length, 
    pages: 1, 
    page: 1, 
    limit: data.length 
  } : (data?.pagination || { total: 0, pages: 1, page: 1, limit: 10 });
  
  const summary = Array.isArray(data) ? {
    total_count: data.length,
    unread_count: data.filter(n => !n.read).length,
    read_count: data.filter(n => n.read).length,
    by_type: {}
  } : (data?.summary || { total_count: 0, unread_count: 0, read_count: 0, by_type: {} });

  // Process settings data
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
    totalPages: pagination.pages,
    totalNotifications: pagination.total,
    unreadCount: summary.unread_count,
    onPageChange: handlePageChange,
    markAsRead: (id: string) => {
      markAsReadMutation.mutate(id);
      // Invalidate unread count query after marking as read
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    markAllAsRead: () => {
      markAllAsReadMutation.mutate();
      // Invalidate unread count query after marking all as read
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    deleteNotification: (id: string) => {
      deleteNotificationMutation.mutate(id);
      // Invalidate unread count query after deleting notification
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
    settings: notificationSettings,
    updateSettings: (newSettings: NotificationSettings) => updateSettingsMutation.mutate(newSettings),
  };
}
