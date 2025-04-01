
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/components/ui/notifications-list";
import { toast } from "sonner";

export function useNotifications() {
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
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
    },
    {
      id: "notif-2",
      title: "Sync completed",
      message: "All properties synchronized with no conflicts",
      type: "sync",
      severity: "success",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() // 5 hours ago
    },
    {
      id: "notif-3",
      title: "Booking conflict detected",
      message: "Mountain Cabin property - Overlapping bookings on Jun 10-15",
      type: "conflict",
      severity: "error",
      read: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
    },
    {
      id: "notif-4",
      title: "Booking modified on Booking.com",
      message: "City Apartment property - Date changed to Jul 10-15",
      type: "booking",
      severity: "info",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
    },
    {
      id: "notif-5",
      title: "New review on Airbnb",
      message: "Beach House property - 5 stars",
      type: "booking",
      severity: "info",
      read: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString() // 1.5 days ago
    }
  ];

  // Get all notifications
  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      // This would be an API call in a real app
      return mockNotifications;
    }
  });

  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      // This would be an API call in a real app
      return { id };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
        old?.map(notification =>
          notification.id === data.id
            ? { ...notification, read: true }
            : notification
        )
      );
      toast.success("Notification marked as read");
    }
  });

  // Mark all as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      // This would be an API call in a real app
      return {};
    },
    onSuccess: () => {
      queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
        old?.map(notification => ({ ...notification, read: true }))
      );
      toast.success("All notifications marked as read");
    }
  });

  // Delete notification
  const deleteNotification = useMutation({
    mutationFn: async (id: string) => {
      // This would be an API call in a real app
      return { id };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notifications"], (old: Notification[] | undefined) =>
        old?.filter(notification => notification.id !== data.id)
      );
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
