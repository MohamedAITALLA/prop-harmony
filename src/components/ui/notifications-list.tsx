import React, { useState } from 'react';
import { Notification } from '@/types/api-responses';
import { formatDistanceToNow } from 'date-fns';
import { Check, X, Bell, AlertTriangle, InfoIcon, Calendar, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { NotificationSeverity, NotificationType } from '@/types/enums';
import { AdvancedPagination } from '@/components/ui/advanced-pagination';

interface NotificationsListProps {
  notifications: Notification[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
}

export function NotificationsList({
  notifications,
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete
}: NotificationsListProps) {
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const handleNotificationSelect = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((n) => n._id));
    }
  };

  const isAllSelected = selectedNotifications.length === notifications.length;

  const handleDeleteSelected = () => {
    selectedNotifications.forEach((id) => {
      if (onDelete) {
        onDelete(id);
      }
    });
    setSelectedNotifications([]);
  };

  const handleMarkSelectedAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead(selectedNotifications);
    }
    setSelectedNotifications([]);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.NEW_BOOKING:
        return <Calendar className="h-4 w-4 text-green-500" />;
      case NotificationType.MODIFIED_BOOKING:
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case NotificationType.CANCELLED_BOOKING:
        return <X className="h-4 w-4 text-red-500" />;
      case NotificationType.BOOKING_CONFLICT:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case NotificationType.SYNC_FAILURE:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case NotificationSeverity.CRITICAL:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case NotificationSeverity.WARNING:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case NotificationSeverity.INFO:
        return <InfoIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <RefreshCw className="h-5 w-5 animate-spin mr-2" />
          <span>Loading notifications...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex items-center justify-center py-4">
          <span>No notifications found.</span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Checkbox
                id="select-all"
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
              />
              <label
                htmlFor="select-all"
                className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Select All
              </label>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkSelectedAsRead}
                disabled={selectedNotifications.length === 0}
              >
                Mark as Read
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedNotifications.length === 0}
                className="ml-2"
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="divide-y divide-border rounded-md border">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-4"
              >
                <Checkbox
                  checked={selectedNotifications.includes(notification._id)}
                  onCheckedChange={() => handleNotificationSelect(notification._id)}
                  id={`notification-${notification._id}`}
                />
                <div className="flex items-center gap-2">
                  {getSeverityIcon(notification.severity)}
                  <div className="grid gap-0.5">
                    <p className="line-clamp-1 text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (onMarkAsRead) {
                        onMarkAsRead(notification._id);
                      }
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (onDelete) {
                        onDelete(notification._id);
                      }
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <AdvancedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.NEW_BOOKING:
      return <Calendar className="h-4 w-4 text-green-500" />;
    case NotificationType.MODIFIED_BOOKING:
      return <RefreshCw className="h-4 w-4 text-blue-500" />;
    case NotificationType.CANCELLED_BOOKING:
      return <X className="h-4 w-4 text-red-500" />;
    case NotificationType.BOOKING_CONFLICT:
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case NotificationType.SYNC_FAILURE:
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
}
