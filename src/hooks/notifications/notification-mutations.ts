
import { useMutation, UseQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/services/notification-service";
import { NotificationSettings } from "@/types/api-responses";

export function useNotificationMutations(queryClient: UseQueryClient) {
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
    mutationFn: async () => {
      return notificationService.markAllAsRead();
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

  return {
    markAsReadMutation,
    markAllAsReadMutation,
    deleteNotificationMutation,
    updateSettingsMutation
  };
}
