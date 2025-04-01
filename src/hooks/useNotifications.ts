
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/components/ui/notifications-list";
import { toast } from "sonner";
import { notificationService } from "@/services/api-service";

export interface NotificationFilters {
  read?: boolean;
  type?: string;
  property_id?: string;
  severity?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useNotifications(filters?: NotificationFilters) {
  const queryClient = useQueryClient();
  
  // Mock notifications data - in a real app, this would come from an API
  const mockNotifications: Notification[] = [
    {
      id: "notif-1",
      title: "New booking on Airbnb",
      message: "Beach House property - Jun 18 to Jun 25",
      type: "booking",
      severity: "info",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      property_id: "prop-1",
      user_id: "user-1"
    },
    {
      id: "notif-2",
      title: "Sync completed",
      message: "All properties synchronized with no conflicts",
      type: "sync",
      severity: "success",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      property_id: "prop-2",
      user_id: "user-1"
    },
    {
      id: "notif-3",
      title: "Booking conflict detected",
      message: "Mountain Cabin property - Overlapping bookings on Jun 10-15",
      type: "conflict",
      severity: "error",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
      property_id: "prop-3",
      user_id: "user-1"
    },
    {
      id: "notif-4",
      title: "Booking modified on Booking.com",
      message: "City Apartment property - Date changed to Jul 10-15",
      type: "booking",
      severity: "info",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      property_id: "prop-4",
      user_id: "user-1"
    },
    {
      id: "notif-5",
      title: "New review on Airbnb",
      message: "Beach House property - 5 stars",
      type: "booking",
      severity: "info",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1.5 days ago
      property_id: "prop-1",
      user_id: "user-1"
    },
    {
      id: "notif-6",
      title: "Sync failed for VRBO",
      message: "Unable to sync with VRBO for Lake House property",
      type: "sync_failure",
      severity: "critical",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      property_id: "prop-5",
      user_id: "user-1"
    },
    {
      id: "notif-7",
      title: "Booking cancelled on Booking.com",
      message: "City Apartment property - Booking for Aug 5-10 cancelled",
      type: "cancelled_booking",
      severity: "warning",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
      property_id: "prop-4",
      user_id: "user-1"
    }
  ];

  // Get all notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      // This would be an API call in a real app
      // We'll filter the mock data here to simulate API filtering
      let filtered = [...mockNotifications];
      
      if (filters) {
        if (filters.read !== undefined) {
          filtered = filtered.filter(n => n.read === filters.read);
        }
        
        if (filters.type) {
          filtered = filtered.filter(n => n.type === filters.type);
        }
        
        if (filters.property_id) {
          filtered = filtered.filter(n => n.property_id === filters.property_id);
        }
        
        if (filters.severity) {
          filtered = filtered.filter(n => n.severity === filters.severity);
        }
        
        // Implement pagination
        if (filters.page !== undefined && filters.limit !== undefined) {
          const start = filters.page * filters.limit;
          const end = start + filters.limit;
          filtered = filtered.slice(start, end);
        }
      }
      
      return filtered;
    }
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      // This would be an API call in a real app
      try {
        // Simulate API call
        await notificationService.markAsRead(id);
        return { id };
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications", filters], (old: Notification[] | undefined) =>
        old?.map(notification =>
          notification.id === data.id
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Also update any other notification queries in the cache
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false,
      });
      
      toast.success("Notification marked as read");
    }
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      // This would be an API call in a real app
      try {
        // Simulate API call
        await notificationService.markAllAsRead();
        return {};
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications", filters], (old: Notification[] | undefined) =>
        old?.map(notification => ({ ...notification, read: true }))
      );
      
      // Also update any other notification queries in the cache
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false,
      });
      
      toast.success("All notifications marked as read");
    }
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      // This would be an API call in a real app
      try {
        // In real implementation, call the API
        // await apiService.delete(`/notifications/${id}`);
        return { id };
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications", filters], (old: Notification[] | undefined) =>
        old?.filter(notification => notification.id !== data.id)
      );
      
      // Also update any other notification queries in the cache
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false,
      });
      
      toast.success("Notification deleted");
    }
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: (id: string) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
    deleteNotification: (id: string) => deleteNotification.mutate(id)
  };
}
