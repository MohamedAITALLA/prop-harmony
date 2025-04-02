
import api from "@/lib/api";
import { 
  NotificationsResponse, 
  ApiResponse, 
  NotificationSettings 
} from "@/types/api-responses";

export const notificationService = {
  getNotifications: async (
    params?: { 
      page?: number; 
      limit?: number; 
      property_id?: string;
      type?: string; 
      severity?: string;
      read?: boolean;
      search?: string;
    }
  ): Promise<NotificationsResponse> => {
    const response = await api.get<NotificationsResponse>("/notifications", { params });
    return response.data;
  },
  
  markAsRead: async (notificationId: string): Promise<ApiResponse<{
    notification: {
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
    };
    action: string;
    previous_state: {
      read: boolean;
    };
    updated_fields: string[];
  }>> => {
    const response = await api.put<ApiResponse<{
      notification: {
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
      };
      action: string;
      previous_state: {
        read: boolean;
      };
      updated_fields: string[];
    }>>(`/notifications/${notificationId}/read`);
    return response.data;
  },
  
  markAllAsRead: async (ids?: string[]): Promise<ApiResponse<{
    updated_count: number;
    action: string;
    user_id: string;
    notification_ids?: string[];
    total_requested?: number;
  }>> => {
    const response = await api.put<ApiResponse<{
      updated_count: number;
      action: string;
      user_id: string;
      notification_ids?: string[];
      total_requested?: number;
    }>>("/notifications/read", ids ? { ids } : undefined);
    return response.data;
  },
  
  deleteNotification: async (
    notificationId: string, 
    preserveHistory?: boolean
  ): Promise<ApiResponse<{
    notification: {
      _id: string;
      type: string;
      title: string;
      created_at: string;
    };
    action: string;
    preserve_history: boolean;
  }>> => {
    const params = preserveHistory !== undefined ? { preserve_history: preserveHistory } : undefined;
    const response = await api.delete<ApiResponse<{
      notification: {
        _id: string;
        type: string;
        title: string;
        created_at: string;
      };
      action: string;
      preserve_history: boolean;
    }>>(`/notifications/${notificationId}`, { params });
    return response.data;
  },
  
  getSettings: async (): Promise<ApiResponse<{
    settings: NotificationSettings;
    user_id: string;
    last_updated: string;
  }>> => {
    const response = await api.get<ApiResponse<{
      settings: NotificationSettings;
      user_id: string;
      last_updated: string;
    }>>("/notifications/settings");
    return response.data;
  },
  
  updateSettings: async (settings: NotificationSettings): Promise<ApiResponse<{
    settings: NotificationSettings;
    user_id: string;
    updated_fields: string[];
    previous_settings: object;
    changes_count: number;
  }>> => {
    const response = await api.put<ApiResponse<{
      settings: NotificationSettings;
      user_id: string;
      updated_fields: string[];
      previous_settings: object;
      changes_count: number;
    }>>("/notifications/settings", settings);
    return response.data;
  }
};
