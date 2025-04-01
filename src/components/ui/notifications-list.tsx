
import React from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { Bell, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  read: boolean;
  created_at: string;
  [key: string]: any;
}

export interface NotificationsListProps extends React.HTMLAttributes<HTMLDivElement> {
  notifications: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onDelete?: (id: string) => void;
  maxHeight?: string | number;
  isLoading?: boolean; // Add the isLoading prop
}

export function NotificationsList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onDelete,
  maxHeight = "300px",
  isLoading = false,
  className,
  ...props
}: NotificationsListProps) {
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const getNotificationIcon = (type: string, read: boolean) => {
    const iconClass = read ? "text-muted-foreground" : "text-primary";
    
    switch (type.toLowerCase()) {
      case "sync":
      case "synced":
        return <Clock className={`h-5 w-5 ${iconClass}`} />;
      case "booking":
      case "reservation":
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
      case "error":
      case "conflict":
        return <Bell className={`h-5 w-5 text-destructive`} />;
      default:
        return <Bell className={`h-5 w-5 ${iconClass}`} />;
    }
  };
  
  const formatTimeAgo = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "PPp");
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <StatusBadge status={`${unreadCount} Unread`} variant="info" size="sm" />
          )}
        </div>
        {unreadCount > 0 && onMarkAllRead && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMarkAllRead}
            className="text-xs"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Mark all read
          </Button>
        )}
      </div>
      
      <ScrollArea className={cn("rounded-md border", `max-h-[${maxHeight}]`)}>
        {isLoading ? (
          <div className="p-6 flex justify-center items-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-3 p-3",
                  !notification.read && "bg-accent/50"
                )}
              >
                <div className="mt-1">
                  {getNotificationIcon(notification.type, notification.read)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={cn("font-medium", !notification.read && "font-semibold")}>
                      {notification.title}
                    </p>
                    <StatusBadge status={notification.severity} size="sm" />
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                    <span title={formatDate(notification.created_at)}>
                      {formatTimeAgo(notification.created_at)}
                    </span>
                    <div className="flex gap-2">
                      {!notification.read && onMarkRead && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs"
                          onClick={() => onMarkRead(notification.id)}
                        >
                          Mark read
                        </Button>
                      )}
                      {onDelete && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                          onClick={() => onDelete(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center p-6 text-center text-muted-foreground">
            <p>No notifications</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
