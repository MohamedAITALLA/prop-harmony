
import { useQuery } from "@tanstack/react-query";
import { NotificationsList, Notification } from "../ui/notifications-list";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface RecentNotificationsProps {
  limit?: number;
  action?: string;
}

export function RecentNotifications({ limit = 5, action }: RecentNotificationsProps) {
  const navigate = useNavigate();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications", "recent"],
    queryFn: async () => {
      // In a real app, we would fetch from the API
      // This is mock data for now
      return [
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
    }
  });

  const handleMarkRead = (id: string) => {
    // In a real app, we would make an API call
    toast.success("Notification marked as read");
  };

  const handleMarkAllRead = () => {
    // In a real app, we would make an API call
    toast.success("All notifications marked as read");
  };
  
  const handleDelete = (id: string) => {
    // In a real app, we would make an API call
    toast.success("Notification deleted");
  };

  return (
    <div>
      <NotificationsList 
        notifications={notifications.slice(0, limit)} 
        isLoading={isLoading}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        onDelete={handleDelete}
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
