
import api from "@/lib/api";
import { NotificationsResponse, ApiResponse, NotificationSettings } from "@/types/api-responses";

export const notificationService = {
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    property_id?: string;
    type?: string;
    severity?: string;
    read?: boolean;
  }): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>("/notifications", { params });
    return response.data;
  },

  markAsRead: async (notificationIds?: string[]): Promise<ApiResponse<{ success: boolean }>> => {
    const payload = notificationIds ? { ids: notificationIds } : {};
    const response = await api.put<ApiResponse<{ success: boolean }>>("/notifications/read", payload);
    return response.data;
  },

  markOneAsRead: async (notificationId: string): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await api.put<ApiResponse<{ success: boolean }>>(`/notifications/${notificationId}/read`);
    return response.data;
  },

  deleteNotification: async (notificationId: string, preserveHistory?: boolean): Promise<ApiResponse<{ success: boolean }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{ success: boolean }>>(`/notifications/${notificationId}`, { params });
    return response.data;
  },

  getSettings: async (): Promise<ApiResponse<NotificationSettings>> => {
    const response = await api.get<ApiResponse<NotificationSettings>>("/notifications/settings");
    return response.data;
  },

  updateSettings: async (settings: Partial<NotificationSettings>): Promise<ApiResponse<NotificationSettings>> => {
    const response = await api.put<ApiResponse<NotificationSettings>>("/notifications/settings", settings);
    return response.data;
  }
};
