
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
  
  // Get all notifications
  const { 
    data: response = { data: { notifications: [], total: 0, total_pages: 0 } },
    isLoading,
    error
  } = useQuery({
    queryKey: ["notifications", filters],
    queryFn: async () => {
      try {
        // In development mode, we'll use mock data
        if (process.env.NODE_ENV === 'development' && !process.env.USE_API) {
          // Mock notifications data for development
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
          
          // Process mock data with filters
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
            
            if (filters.search) {
              const searchLower = filters.search.toLowerCase();
              filtered = filtered.filter(n => 
                n.title.toLowerCase().includes(searchLower) || 
                n.message.toLowerCase().includes(searchLower)
              );
            }
            
            // Implement pagination
            if (filters.page !== undefined && filters.limit !== undefined) {
              const start = (filters.page - 1) * filters.limit;
              const end = start + filters.limit;
              filtered = filtered.slice(start, end);
            }
          }
          
          return { 
            data: { 
              notifications: filtered,
              total: mockNotifications.length,
              total_pages: Math.ceil(mockNotifications.length / (filters?.limit || 10))
            } 
          };
        }
        
        // Real API call
        return await notificationService.getNotifications({
          page: filters?.page,
          limit: filters?.limit,
          property_id: filters?.property_id,
          type: filters?.type,
          severity: filters?.severity,
          read: filters?.read,
        });
      } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
  });

  const notifications = response.data.notifications || [];
  
  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      try {
        await notificationService.markAsRead(id);
        return { id };
      } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications", filters], (old: any) => {
        if (!old?.data?.notifications) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((notification: Notification) =>
              notification.id === data.id
                ? { ...notification, read: true }
                : notification
            )
          }
        };
      });
      
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
      try {
        await notificationService.markAllAsRead();
        return {};
      } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications", filters], (old: any) => {
        if (!old?.data?.notifications) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.map((notification: Notification) => 
              ({ ...notification, read: true })
            )
          }
        };
      });
      
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
      try {
        await notificationService.deleteNotification(id);
        return { id };
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications", filters], (old: any) => {
        if (!old?.data?.notifications) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            notifications: old.data.notifications.filter((notification: Notification) => 
              notification.id !== data.id
            ),
            total: Math.max(0, old.data.total - 1),
            total_pages: Math.max(1, Math.ceil((old.data.total - 1) / (filters?.limit || 10)))
          }
        };
      });
      
      // Also update any other notification queries in the cache
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
        exact: false,
      });
      
      toast.success("Notification deleted");
    }
  });

  // Get notification settings
  const { data: settings } = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async () => {
      try {
        if (process.env.NODE_ENV === 'development' && !process.env.USE_API) {
          // Mock settings for development
          return {
            data: {
              email_notifications: true,
              new_booking_notifications: true,
              modified_booking_notifications: true,
              cancelled_booking_notifications: true,
              conflict_notifications: true,
              sync_failure_notifications: true
            }
          };
        }
        
        return await notificationService.getSettings();
      } catch (error) {
        console.error("Error fetching notification settings:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update notification settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: {
      email_notifications?: boolean;
      new_booking_notifications?: boolean;
      modified_booking_notifications?: boolean;
      cancelled_booking_notifications?: boolean;
      conflict_notifications?: boolean;
      sync_failure_notifications?: boolean;
    }) => {
      try {
        await notificationService.updateSettings(newSettings);
        return newSettings;
      } catch (error) {
        console.error("Error updating notification settings:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notification-settings"], (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            ...data
          }
        };
      });
      
      toast.success("Notification settings updated");
    }
  });

  return {
    notifications,
    totalNotifications: response.data.total,
    totalPages: response.data.total_pages,
    unreadCount,
    isLoading,
    error,
    markAsRead: (id: string) => markAsRead.mutate(id),
    markAllAsRead: () => markAllAsRead.mutate(),
    deleteNotification: (id: string) => deleteNotification.mutate(id),
    notificationSettings: settings?.data || {},
    updateNotificationSettings: (newSettings: any) => updateSettings.mutate(newSettings)
  };
}
