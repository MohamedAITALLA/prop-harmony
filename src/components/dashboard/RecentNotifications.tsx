
import { useNavigate } from "react-router-dom";
import { NotificationsList } from "../ui/notifications-list";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface RecentNotificationsProps {
  limit?: number;
  action?: string;
}

export function RecentNotifications({ limit = 5, action = "View all notifications" }: RecentNotificationsProps) {
  const navigate = useNavigate();
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications({ 
    limit,
    page: 1
  });

  return (
    <div>
      <NotificationsList 
        notifications={notifications.slice(0, limit).map(notification => ({
          _id: notification._id,
          id: notification._id, // For backwards compatibility with components expecting id
          type: notification.type,
          title: notification.title,
          message: notification.message,
          severity: notification.severity,
          read: notification.read,
          created_at: notification.created_at,
          updated_at: notification.updated_at,
          age_in_hours: notification.age_in_hours,
          is_recent: notification.is_recent,
          user_id: notification.user_id,
          property_id: notification.property_id
        }))} 
        isLoading={isLoading}
        onMarkRead={markAsRead}
        onMarkAllRead={markAllAsRead}
        onDelete={deleteNotification}
        maxHeight="400px"
      />
      
      {action && (
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/notifications")}
            className="gap-2"
          >
            {action}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
