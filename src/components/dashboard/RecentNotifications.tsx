
import { useNavigate } from "react-router-dom";
import { NotificationsList } from "../ui/notifications-list";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

interface RecentNotificationsProps {
  limit?: number;
  action?: string;
}

export function RecentNotifications({ limit = 5, action }: RecentNotificationsProps) {
  const navigate = useNavigate();
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  return (
    <div>
      <NotificationsList 
        notifications={notifications.slice(0, limit)} 
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
